<template>
  <el-upload
    ref="uploadRef"
    class="upload-demo"
    action=""
    :auto-upload="false"
    :on-change="fileChangeHandle"
    :show-file-list="false"
    accept=".xlsx"
  >
    <template #trigger>
      <el-button type="primary">execl导入</el-button>
    </template>
  </el-upload>
  <el-button @click="exportHandle">execl导出</el-button>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { UploadInstance } from 'element-plus'
import Excel from 'exceljs'
import FileSaver from 'file-saver'

const uploadRef = ref<UploadInstance>()

const fileChangeHandle = async (file: any) => {
  const workbook = new Excel.Workbook()
  //await workbook.xlsx.readFile(filename);从文件读取
  //await workbook.xlsx.read(stream);从流读取
  //await workbook.xlsx.load(data);从 buffer 加载
  const result = await workbook.xlsx.load(file.raw)
  // 按 name 提取工作表 workbook.getWorksheet('My Sheet');
  // 按 id 提取工作表 workbook.getWorksheet(1);
  const worksheet = result.getWorksheet(1)
  //遍历工作表中具有值的所有行
  worksheet.eachRow((row, rowIndex) => {
    console.log(row.values, rowIndex)
  })
  //   workbook.eachSheet((sheet, id) => {
  //     sheet.eachRow((row, rowIndex) => {
  //       console.log(row.values, rowIndex)
  //     })
  //   })
}

const exportHandle = async () => {
  const title = 'test'
  const columns = [
    { header: '序号', key: 'num', style: { numFmt: '@' } },
    { header: '员工姓名', key: 'personName', width: 15, style: { numFmt: '@' } },
    { header: '证件类型', key: 'idcardType', width: 15, style: { numFmt: '@' } },
    { header: '证件号码', key: 'idcard', width: 25, style: { numFmt: '@' } },
    {
      header: '员工银行卡账号（仅支持本人银行卡号，非本人的银行卡或存折将导致打款失败）',
      key: 'userBankNo',
      width: 35,
      style: { numFmt: '@' }
    },
    { header: '手机号', key: 'userPhone', width: 25, style: { numFmt: '@' } }
  ]
  const data = [
    {
      num: 0,
      personName: '早早',
      idcardType: '身份证',
      idcard: 12312323,
      userBankNo: '213123123321',
      userPhone: '123123'
    }
  ]

  const workbook = new Excel.Workbook()
  workbook.creator = 'test'
  let sheet = workbook.addWorksheet('报表')
  sheet.columns = columns
  sheet.addRows(data)
  //配置表格枚举
  for (let index = 2; index < data.length + 1000; index++) {
    sheet.getCell(`C${index}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      showErrorMessage: true,
      showInputMessage: true,
      errorStyle: 'error',
      formulae: ['"身份证,港澳台居住证,护照,其他"'],
      prompt: '证件类型只可以是"身份证,港澳台居住证,护照,其他"',
      error: '证件类型只可以是"身份证,港澳台居住证,护照,其他"'
    }
  }
  const buffer = await workbook.xlsx.writeBuffer()
  FileSaver.saveAs(new Blob([buffer]), `${title}.xlsx`)
}
</script>
