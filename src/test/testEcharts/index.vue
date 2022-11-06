<template>
  <div id="main" style="width: 100%; height: 100%"></div>
</template>
<script setup lang="ts">
import { getCurrentInstance, onMounted } from 'vue'
import worldZH from './json/worldZH.json'
console.log(worldZH)

const { appContext } = getCurrentInstance()!
console.log(appContext.config.globalProperties)
onMounted(() => {
  const echarts = appContext.config.globalProperties.$echarts
  echarts.registerMap('world', worldZH)

  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(document.getElementById('main'))
  const mapName = 'world'

  //自定义城市坐标菜单
  const geoCoordMap = {
    中国: [121.15, 31.89],
    鄂尔多斯: [109.781327, 39.608266],
    招远: [120.38, 37.35],
    舟山: [122.207216, 29.985295],
    齐齐哈尔: [123.97, 47.33],
    盐城: [120.13, 33.38],
    赤峰: [118.87, 42.28],
    青岛: [120.33, 36.07],
    乳山: [121.52, 36.89],
    金昌: [102.188043, 38.520089]
  }

  const convertData = function (data) {
    const res: any = []
    for (let i = 0; i < data.length; i++) {
      const geoCoord = geoCoordMap[data[i].name] //获取坐标
      if (geoCoord) {
        //如果有坐标
        res.push({
          //创建对象数组，
          name: data[i].name,
          value: geoCoord.concat(data[i].value) //用连接数组的形式将value值加入
        })
      }
    }
    return res
  }

  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '世界地图',
      x: 'center',
      textStyle: {
        fontSize: 24
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        let toolTiphtml = ''
        if (!params.value?.[2]) {
          toolTiphtml = params.name + '确诊: 0例'
        } else {
          toolTiphtml = params.name + '确诊: ' + params.value?.[2] + '例'
        }
        console.log(params, params.value?.[2], toolTiphtml)
        return toolTiphtml
      }
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    visualMap: {
      show: true,
      left: 'left',
      top: 'bottom',
      seriesIndex: [0],
      type: 'piecewise',
      pieces: [
        { min: 20, color: 'rgb(254,57,101)' },
        { min: 15, max: 20, color: 'rgb(252,157,154)' },
        { min: 10, max: 15, color: 'rgb(249,205,173)' },
        { min: 5, max: 10, color: 'rgb(200,200,169)' },
        { min: 1, max: 5, color: 'rgb(131,175,155)' }
      ],
      textStyle: {
        color: '#000000'
      }
    },
    geo: {
      show: true,
      map: mapName,
      label: {
        // show: true
      },
      roam: true, // 可以缩放和平移
      aspectScale: 0.8, // 比例
      // layoutCenter: ['90%', '78%'], // position位置
      // layoutSize: '80%', // 地图大小，保证了不超过 370x370 的区域
      center: [2.213749, 46.227638],
      zoom: 5,
      itemStyle: {
        areaColor: '#eee', //F6F6F6
        borderColor: '#666'
      },
      emphasis: {
        // disabled: true,
        itemStyle: {
          areaColor: 'pink'
        }
      }
    },
    series: [
      // {
      //   type: 'map',
      //   map: mapName,
      //   geoIndex: 0,
      //   animation: false,
      //   data: [{ name: '中国', value: 9 }]
      // },
      {
        name: 'pm2.5',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertData([
          { name: '中国', value: 9 },
          { name: '鄂尔多斯', value: 12 },
          { name: '招远', value: 12 },
          { name: '舟山', value: 12 },
          { name: '齐齐哈尔', value: 14 },
          { name: '盐城', value: 15 },
          { name: '赤峰', value: 100 },
          { name: '青岛', value: 18 },
          { name: '乳山', value: 300 },
          { name: '金昌', value: 19 }
        ]),
        symbolSize: 12,
        //直接在点上显示标签
        label: {
          show: false,
          formatter: '{b}',
          offset: [15, -15] //文字的相对偏移
        }
      }
    ]
  }

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
  myChart.on('click', (params) => {
    // 点击下钻的操作写在这里
    console.log(params)
  })
})
</script>
<style scoped lang="scss"></style>
