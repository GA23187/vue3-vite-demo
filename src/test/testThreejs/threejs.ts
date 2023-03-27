import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class ThreeJs {
  scene: THREE.Scene | null = null
  camera: THREE.PerspectiveCamera | null = null
  renderer: THREE.WebGLRenderer | null = null
  ambientLight: THREE.AmbientLight | null = null
  mesh: THREE.Mesh | null = null
  phoneMesh: THREE.Group | null = null
  controls: OrbitControls | null = null

  constructor(dom) {
    this.init(dom)
  }

  init(dom) {
    // 场景
    this.scene = new THREE.Scene()
    // 相机
    this.createCamera()
    // 渲染器
    this.createRenderer(dom)
    // 灯光
    this.createLight()
    // 创建几何体
    // this.createCube()
    // 加载手机
    this.loadGLB()
    // 辅助轴
    this.createAxesHelper()
    // 控制器
    this.createControl()
    // 动画 不断更新
    this.animate()
  }

  // 设置渲染器
  createRenderer(dom) {
    this.renderer = new THREE.WebGLRenderer()
    // 设置画布的大小
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    //这里 其实就是canvas 画布  renderer.domElement
    dom.appendChild(this.renderer.domElement)
  }

  // 渲染
  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera)
    }
  }
  // 辅助轴
  createAxesHelper() {
    if (this.scene) {
      const axesHelper = new THREE.AxesHelper(5)
      this.scene.add(axesHelper)
    }
  }
  // 控制器
  createControl() {
    if (this.camera && this.renderer) {
      // Orbit controls（轨道控制器）可以使得相机围绕目标进行轨道运动
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.camera.position.set(10, 10, 10)
      // 使动画循环使用时阻尼或自转 意思是否有惯性
      this.controls.enableDamping = true
      //动态阻尼系数 就是鼠标拖拽旋转灵敏度
      //controls.dampingFactor = 0.25;
      //是否可以缩放
      this.controls.enableZoom = true
      //是否自动旋转
      this.controls.autoRotate = false
      //设置相机距离原点的最远距离
      this.controls.minDistance = 0
      //设置相机距离原点的最远距离
      this.controls.maxDistance = 10000
      //是否开启右键拖拽
      this.controls.enablePan = true
      this.controls.update()
    }
  }
  // 创建透视相机
  createCamera() {
    // 第二参数就是 长度和宽度比 默认采用浏览器  返回以像素为单位的窗口的内部宽度和高度
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    // this.camera.lookAt(1, 1, 1)
  }
  // 创建光
  createLight() {
    if (this.scene) {
      this.ambientLight = new THREE.AmbientLight(0xffffff) // 环境光
      this.scene.add(this.ambientLight)

      const directionalLight = new THREE.DirectionalLight('#ffffff', 1) // 方向光
      directionalLight.castShadow = true
      directionalLight.shadow.camera.far = 20
      directionalLight.shadow.mapSize.set(1024, 1024)
      directionalLight.shadow.normalBias = 0.05
      directionalLight.position.set(1, 3, 5)
      this.scene.add(directionalLight)
    }
  }
  // 创建网格模型
  createCube() {
    if (this.scene) {
      const geometry = new THREE.BoxGeometry(1, 1, 1) //创建一个立方体几何对象Geometry
      const material = new THREE.MeshBasicMaterial({ color: 0xff3200 }) //材质对象Material
      this.mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
      this.scene.add(this.mesh) //网格模型添加到场景中
      geometry.computeBoundingBox() // 执行这个才可以获取到
      console.log(geometry.boundingBox, '几何体的盒子范围')
    }
  }
  // 加载手机
  loadGLB() {
    // 加载管理
    // const loadingManager = new THREE.LoadingManager()
    // loadingManager.onLoad = () => {
    //   console.log('xxxxxxxxxxxxxxx')
    // }
    // 使用 dracoLoader 加载用blender压缩过的模型
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    dracoLoader.setDecoderConfig({ type: 'js' })
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    //通过x,y,z指定旋转中心，obj是要旋转的对象
    function changePivot(x, y, z, obj) {
      // 默认情况下，对象的旋转中心都是自身的中心。
      // 对于组对象而言，也是如此。因此，可以利用这个特点，实现对象绕任何点旋转，也就是指定旋转中心。
      const wrapper = new THREE.Object3D()
      wrapper.position.set(x, y, z)
      wrapper.add(obj)
      obj.position.set(-x, -y, -z)
      return wrapper
    }

    loader.load(
      '/models/iphone.glb',
      (mesh) => {
        if (mesh.scene) {
          //   mesh.scene.traverse((item) => {
          //     console.log(item)
          //   })
          mesh.scene.scale.set(60, 60, 60)
          // threejs获取模型大小
          const box = new THREE.Box3().setFromObject(mesh.scene)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          console.log(box, center, size, 'box center,size')

          this.phoneMesh = mesh.scene
          this.phoneMesh.rotation.y = -Math.PI
          this.phoneMesh.position.x = 2.5
          // Three.js 旋转 rotation\rotateOnAxis\rotateX https://blog.csdn.net/weixin_39423672/article/details/116517571
          // 以左面的一条边为轴进行旋转
          const axis = new THREE.Vector3(-1, 0, 0)
          const angle = Math.PI / 2
          this.phoneMesh.rotateOnAxis(axis, angle)

          // 创建一个组
          const wrapper = new THREE.Object3D()
          wrapper.position.set(0, 0, 0)
          // 将container对象绕世界坐标系的y轴旋转45度，使box的局部坐标系x轴与世界坐标系z轴夹角为45度
          //   wrapper.rotateY(-Math.PI / 4)
          // 将container对象绕其局部坐标系的x轴旋转45度，使box的局部坐标系y轴与世界坐标系z轴夹角为45度
          //   wrapper.rotateX(Math.PI / 4)
          wrapper.add(this.phoneMesh)
          this.scene?.add(wrapper)
          //   this.scene.add(this.phoneMesh)
        }
      },
      (progress) => {
        //   console.log(progress, 'progress')
      }
    )
  }

  // 动画
  animate() {
    requestAnimationFrame(this.animate.bind(this))
    if (this.mesh) {
      this.mesh.rotation.x += 0.01
      this.mesh.rotation.y += 0.01
    }
    // 更新控制器
    this.controls?.update()
    this.render()
  }
}
