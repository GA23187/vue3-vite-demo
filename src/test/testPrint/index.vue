<template>
  <div class="d-f">
    <div class="fx-1">
      <h1>打印普通表格</h1>
      <el-button @click="printHandle">打印</el-button>
      <div class="print-table-wrap" ref="printRef">
        <label for="pet-select">Choose a pet:</label>
        <select name="pets" id="pet-select">
          <option value="">--Please choose an option--</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="hamster">Hamster</option>
          <option value="parrot">Parrot</option>
          <option value="spider">Spider</option>
        </select>
        <label for="pet-select">Choose a pet:</label>
        <select name="petssss" multiple id="pet-select">
          <option value="">--Please choose some option--</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="hamster">Hamster</option>
          <option value="parrot">Parrot</option>
          <option value="spider">Spider</option>
        </select>
        <el-form :model="form" label-width="120px">
          <el-form-item label="Activity name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="Activity zone">
            <el-select v-model="form.region" placeholder="please select your zone">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="Activity time">
            <el-col :span="11">
              <el-date-picker
                v-model="form.date1"
                type="date"
                placeholder="Pick a date"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="2" class="text-center">
              <span class="text-gray-500">-</span>
            </el-col>
            <el-col :span="11">
              <el-time-picker v-model="form.date2" placeholder="Pick a time" style="width: 100%" />
            </el-col>
          </el-form-item>
          <el-form-item label="Instant delivery">
            <el-switch v-model="form.delivery" />
          </el-form-item>
          <el-form-item label="Activity type">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="Online activities" name="type" />
              <el-checkbox label="Promotion activities" name="type" />
              <el-checkbox label="Offline activities" name="type" />
              <el-checkbox label="Simple brand exposure" name="type" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="Resources">
            <el-radio-group v-model="form.resource">
              <el-radio label="Sponsor" />
              <el-radio label="Venue" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Activity form">
            <el-input v-model="form.desc" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Create</el-button>
            <el-button>Cancel</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" height="250" style="width: 100%">
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </div>
    </div>
    <div class="fx-1 ml">
      <h1>打印标签纸</h1>
      <el-button @click="printHandle2">打印</el-button>
      <div class="print-page-wrap" ref="printRef2">
        <div v-for="item in list" class="card">
          <div class="head">Tiger</div>
          <div class="item">
            <span class="key">日期: </span>
            <span class="value">{{ item.date }}</span>
          </div>
          <div class="item">
            <span class="key"> 名称: </span>
            <span class="value">{{ item.name }}</span>
          </div>
          <div class="item">
            <span class="key"> 描述: </span>
            <span class="value">{{ item.desc }}</span>
          </div>
          <div class="item">
            <span class="key"> 更小的描述: </span>
            <span class="value-min">{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { appContext } = getCurrentInstance()!
const $print = appContext.config.globalProperties.$print
const printRef = ref()
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
})
const onSubmit = () => {
  console.log('submit!')
}
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
const printHandle = () => {
  $print(printRef.value)
}

const printRef2 = ref()
const list = ref([
  {
    number: 'SNM123213DDSS',
    name: '测试',
    date: '2020-02-02 12:23:09',
    desc: '一些内容偶像偶像偶像哦偶像偶像'
  },
  {
    number: 'SNM123213DDSS',
    name: '测试',
    date: '2020-02-02 12:23:09',
    desc: '一些内容偶像偶像偶像哦偶像偶像'
  },
  {
    number: 'SNM123213DDSS',
    name: '测试',
    date: '2020-02-02 12:23:09',
    desc: '一些内容偶像偶像偶像哦偶像偶像'
  },
  {
    number: 'SNM123213DDSS',
    name: '测试',
    date: '2020-02-02 12:23:09',
    desc: '一些内容偶像偶像偶像哦偶像偶像'
  },
  {
    number: 'SNM123213DDSS',
    name: '测试',
    date: '2020-02-02 12:23:09',
    desc: '一些内容偶像偶像偶像哦偶像偶像'
  }
])
const printHandle2 = () => {
  $print(printRef2.value)
}
</script>
<style scoped lang="scss">
.d-f {
  display: flex;
}
.fx-1 {
  flex: 1;
}
.ml {
  margin-left: 16px;
}
.print-table-wrap {
  background-image: url('/src/assets/images/lemon.jpg');
}
.print-page-wrap {
  display: flex;
  flex-wrap: wrap;
  .card {
    width: 250px;
    text-align: left;
    border: 1px solid #ccc;
    padding: 10px;
    .head {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .item {
      margin-bottom: 10px;
      .key {
        font-size: 14px;
        padding-bottom: 5px;
        font-weight: bold;
        display: inline-block;
      }
      .value {
        font-size: 14px;
        padding-bottom: 5px;
        display: inline-block;
        border-bottom: 1px solid #000;
      }
      .value-min {
        font-size: 14px;
        transform: scale(0.5);
        transform-origin: 0 0;
        padding-bottom: 5px;
        display: inline-block;
        border-bottom: 1px solid #000;
      }
    }
  }
}
</style>
