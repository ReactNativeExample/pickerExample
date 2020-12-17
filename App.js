import React, {Component} from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Image, TouchableOpacity, NativeModules, Dimensions,
} from 'react-native';

import Video from 'react-native-video';

import SYImagePicker from 'react-native-syan-image-picker';


import ImagePicker from 'react-native-customized-image-picker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    marginBottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      images: null,
    };
  }

  pickSingleBase64(cropit) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      includeBase64: true,
    }).then(images => {
      this.setState({
        images: images.map(i => {
          console.log('received image', i);
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        }),
      });
    }).catch(e => alert(e));
  }

  pickSingle(cropit) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      isSelectBoth: true,
      isCamera: true,
    }).then(images => {
      this.setState({
        images: images.map(i => {
          console.log('received image', i);
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        }),
      });
    }).catch(e => {
      console.log(e.code);
      alert(e);
    });
  }

  pickSingleVideo(cropit) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      isVideo: true,
      isCamera: true,
      cropping: cropit,
    }).then(images => {
      this.setState({
        images: images.map(i => {
          console.log('received image', i);
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        }),
      });
    }).catch(e => {
      console.log(e.code);
      alert(e);
    });
  }

  pickMultipleVideo(cropit) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      isVideo: true,
      isCamera: true,
      multiple: true,
      cropping: cropit,
    }).then(images => {
      this.setState({
        images: images.map(i => {
          console.log('received image', i);
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        }),
      });
    }).catch(e => {
      console.log(e.code);
      alert(e);
    });
  }

  pickSingleAndCamera() {
    ImagePicker.openPicker({
      isCamera: true,
      openCameraOnStart: true,
      returnAfterShot: true,
    }).then(images => {
      this.setState({
        images: images.map(i => {
          console.log('received image', i);
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        }),
      });
    }).catch(e => {
      console.log(e.code);
      alert(e);
    });
  }

  pickMultiple() {
    ImagePicker.openPicker({
      isCamera: true,
      multiple: true,
    }).then(images => {
      this.setState({
        images: images.map(i => {
          console.log('received image', i);
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        }),
      });
    }).catch(e => alert(e));
  }

  scaledHeight(oldW, oldH, newW) {
    return (oldH / oldW) * newW;
  }

  renderVideo(uri) {
    return <View style={{height: 300, width: 300}}>
      <Video source={{uri}}
             style={{
               position: 'absolute',
               top: 0,
               left: 0,
               bottom: 0,
               right: 0,
             }}
             rate={1}
             paused={false}
             volume={1}
             muted={false}
             resizeMode={'cover'}
             onLoad={load => console.log(load)}
             onProgress={() => {
             }}
             onEnd={() => {
               console.log('Done!');
             }}
             repeat={true}/>
    </View>;
  }

  renderImage(image) {
    return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image}/>;
  }

  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image.uri);
    }

    return this.renderImage(image);
  }

  render() {
    return <View style={styles.container}>
      <ScrollView>
        {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
      </ScrollView>

      <TouchableOpacity onPress={() => this.pickSingle(false)} style={styles.button}>
        <Text style={styles.text}>Select Single</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.pickSingleVideo(false)} style={styles.button}>
        <Text style={styles.text}>Select Single video</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.pickMultipleVideo(false)} style={styles.button}>
        <Text style={styles.text}>Select multiple video</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.pickSingleBase64(false)} style={styles.button}>
        <Text style={styles.text}>Select Single Returning Base64</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.pickSingle(true)} style={styles.button}>
        <Text style={styles.text}>Select Single With Cropping</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.pickSingleAndCamera()} style={styles.button}>
        <Text style={styles.text}>Select Single With Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={this.pickMultiple.bind(this)} style={styles.button}>
        <Text style={styles.text}>Select Multiple</Text>
      </TouchableOpacity>

      <View>
        <TouchableOpacity onPress={this.handleLaunchCamera.bind(this)} style={styles.button}>
          <Text style={styles.text}>拍照</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleOpenImagePicker.bind(this)} style={styles.button}>
          <Text style={styles.text}>开启压缩</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleAsyncSelectPhoto.bind(this)} style={styles.button}>
          <Text style={styles.text}>关闭压缩</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handlePromiseSelectPhoto.bind(this)} style={styles.button}>
          <Text style={styles.text}>选择照片(Promise)带base64</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleDeleteCache.bind(this)} style={styles.button}>
          <Text style={styles.text}>缓存清除</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleOpenVideoPicker.bind(this)} style={styles.button}>
          <Text style={styles.text}>选择视频</Text>
        </TouchableOpacity>
      </View>
    </View>;
  }


  handleOpenImagePicker = () => {
    SYImagePicker.showImagePicker(
        {
          imageCount: 1,
          isRecordSelected: true,
          isCrop: true,
          showCropCircle: true,
          quality: 90,
          compress: true,
          enableBase64: false,
        },
        (err, photos) => {
          console.log('开启', err, photos);
          if (!err) {
            this.setState({
              photos,
            });
          } else {
            console.log(err);
          }
        },
    );
  };

  /**
   * 使用方式sync/await
   * 相册参数暂时只支持默认参数中罗列的属性；
   * @returns {Promise<void>}
   */
  handleAsyncSelectPhoto = async () => {
    // SYImagePicker.removeAllPhoto()
    try {
      const photos = await SYImagePicker.asyncShowImagePicker({
        // allowPickingOriginalPhoto: true,
        imageCount: 1,
        isGif: true,
        enableBase64: true,
      });
      console.log('关闭', photos);
      // 选择成功
      this.setState({
        photos: [...this.state.photos, ...photos],
      });
    } catch (err) {
      console.log(err);
      // 取消选择，err.message为"取消"
    }
  };

  handlePromiseSelectPhoto = () => {
    SYImagePicker.asyncShowImagePicker({imageCount: 3})
        .then(photos => {
          console.log(photos);
          const arr = photos.map(v => {
            return v;
          });
          // 选择成功
          this.setState({
            photos: [...this.state.photos, ...arr],
          });
        })
        .catch(err => {
          // 取消选择，err.message为"取消"
        });
  };

  handleLaunchCamera = async () => {
    //await this.requestPermission();
    SYImagePicker.openCamera(
        {isCrop: true, showCropCircle: true, showCropFrame: false},
        (err, photos) => {
          console.log(err, photos);
          if (!err) {
            this.setState({
              photos: [...this.state.photos, ...photos],
            });
          }
        },
    );
  };

  handleDeleteCache = () => {
    SYImagePicker.deleteCache();
  };

  handleOpenVideoPicker = () => {
    SYImagePicker.openVideoPicker(
        {allowPickingMultipleVideo: true},
        (err, res) => {
          console.log(err, res);
          if (!err) {
            let photos = [...this.state.photos];
            res.map(v => {
              photos.push({...v, uri: v.coverUri});
            });
            this.setState({
              photos,
            });
          }
        },
    );
  };

}
