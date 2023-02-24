<template>
  <div>
    <el-upload
      :action="useOss?ossUploadUrl:minioUploadUrl"
      :data="useOss?dataObj:null"
      list-type="picture"
      :multiple="false"
      :file-list="fileList"
      :show-file-list="showFileList"
      :before-upload="beforeUpload"
      :on-success="handleUploadSuccess"
      :on-remove="handleRemove"
      accept=".png, .jpg"
      :limit="5"
      :on-exceed="handleExceed"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500KB</div>
    </el-upload>
  </div>
</template>
<script>
import { policy } from '@/api/oss'

export default {
  name: 'SingleUploadList',
  props: {
    value: String
  },
  data() {
    return {
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: ''
        // callback:'',
      },
      dialogVisible: false,
      useOss: false, // 使用oss->true;使用MinIO->false
      ossUploadUrl: 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com',
      minioUploadUrl: process.env.BASE_API + '/minio/upload',
      fileList: []
    }
  },
  computed: {
    imageUrl() {
      return this.value
    },
    imageName() {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf('-') + 1)
      } else {
        return null
      }
    },

    showFileList: {
      get: function() {
        return this.value !== null && this.value !== '' && this.value !== undefined
      },
      set: function(newValue) {
      }
    }
  },
  watch: {
    imageUrl: function() {
      this.fileList = []
      if (this.value) {
        const values = this.value.split(',')
        for (let i = 0; i < values.length; i++) {
          var name = values[i].substr(values[i].lastIndexOf('-') + 1)
          this.fileList.push({ name: name, url: values[i] })
        }
      }
    }
  },

  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleRemove(file, fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const uid = fileList[i].uid
        if (uid === file.uid) {
          fileList.splice(i, 1)
          i--
        }
      }
      var str = ''
      for (let i = 0; i < fileList.length; i++) {
        if (i !== 0) {
          str = str + ','
        }
        str = str + fileList[i].url
      }
      this.emitInput(str)
    },
    handlePreview(file) {
      this.dialogVisible = true
    },
    beforeUpload(file) {
      const _self = this
      if (!this.useOss) {
        // 不使用oss不需要获取策略
        return true
      }
      return new Promise((resolve, reject) => {
        policy().then(response => {
          _self.dataObj.policy = response.data.policy
          _self.dataObj.signature = response.data.signature
          _self.dataObj.ossaccessKeyId = response.data.accessKeyId
          _self.dataObj.key = response.data.dir + '/${filename}'
          _self.dataObj.dir = response.data.dir
          _self.dataObj.host = response.data.host
          // _self.dataObj.callback = response.data.callback;
          resolve(true)
        }).catch(err => {
          reject(false)
        })
      })
    },
    handleUploadSuccess(res, file) {
      this.showFileList = true
      // this.fileList.pop()
      let url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name
      if (!this.useOss) {
        // 不使用oss直接获取图片路径
        url = res.data.url
      }
      this.fileList.push({ name: file.name, url: url })
      var files = this.fileList
      var str = ''
      for (let i = 0; i < files.length; i++) {
        if (i !== 0) {
          str = str + ','
        }
        str = str + files[i].url
      }
      this.emitInput(str)
    }
  }
}
</script>
<style>

</style>

