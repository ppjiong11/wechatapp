// index.ts
Page({
  data: {
    inputValue: ''
  },

  onInput: function (e: any) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  sendMessage: function () {
    // 异或加密
    const key: number = 0x000000F0;
    const encryptedMessage: string = this.encryptMessage(this.data.inputValue, key);

    // 调用后端接口发送加密后的消息
    wx.request({
      url: 'http://127.0.0.1:8000/receive_message',
      method: 'POST',
      data: {
        message: encryptedMessage
      },
      success: function (res) {
        console.log('消息发送成功', res.data);
      },
      fail: function (error) {
        console.error('消息发送失败', error);
      }
    });
  },

  takePhoto: function () {
    wx.chooseImage({
      sourceType: ['camera'],
      sizeType: ['compressed'], // 请求压缩的图片
      success: function (res) {
        const tempFilePath: string = res.tempFilePaths[0];

        wx.uploadFile({
          url: 'http://127.0.0.1:8000/receive_message',
          filePath: tempFilePath,
          name: 'file',
          formData: {
            // 可以添加额外的表单数据
            // key: value
          },
          success: function (uploadRes) {
            console.log('上传成功', uploadRes.data);
          },
          fail: function (uploadError) {
            console.error('上传失败', uploadError);
          }
        });
      },
      fail: function (error) {
        console.error('调用摄像头失败', error);
      }
    });
  },

  encryptMessage: function (message: string, key: number): string {
    let encryptedMessage: string = '';
    for (let i: number = 0; i < message.length; i++) {
      const charCode: number = message.charCodeAt(i) ^ key;
      encryptedMessage += String.fromCharCode(charCode);
    }
    return encryptedMessage;
  }
});


// 将文字信息存储到本地缓存中
wx.setStorage({
  key: 'textData',
  data: '用户采集的文字信息',
  success: function () {
    console.log('文字信息存储成功');
  },
});

// 从本地缓存中读取文字信息
wx.getStorage({
  key: 'textData',
  success: function (res) {
    const textData = res.data;
    console.log('读取到的文字信息：', textData);
  },
});

// 清除文字信息的本地缓存
wx.removeStorage({
  key: 'textData',
  success: function (res) {
    console.log('文字信息缓存已清除');
  },
});
