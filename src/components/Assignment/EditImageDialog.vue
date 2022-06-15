<template>
  <q-card class="edit-image-dialog-card">
    <q-card-section class="row justify-between bg-primary text-white">
      <div class="text-h6 text-bold">Edit Product Image</div>
      <div>
        <q-btn
          flat
          dense
          rounded
          icon="close"
          color="white"
          @click="closeDialog"
        />
      </div>
    </q-card-section>
    <img id="Image1" />
    <div>
      <!-- <input
        ref="input"
        type="file"
        name="image"
        src="imgSrc"
        accept="image/*"
        @change="setImage"
      /> -->
      <div class="content">
        <section class="cropper-area">
          <div class="img-cropper q-pa-sm" style="width: 500px; height: 500px">
            <vue-cropper
              ref="cropper"
              :initialAspectRatio="1 / 1"
              :src="imgSrc"
              preview=".preview "
            />
          </div>
        </section>
        <section class="preview-area q-pa-md q-pt-xl">
          <p>Preview</p>
          <div class="preview" />
        </section>
      </div>
    </div>

    <q-card-actions align="right">
      <q-btn label="Crop" no-caps color="primary" @click.prevent="cropImage" />
    </q-card-actions>
  </q-card>
</template>

<script>
import VueCropper from "vue-cropperjs";
import { Loading, LocalStorage } from "quasar";
import "cropperjs/dist/cropper.css";
const imageToBase64 = require("image-to-base64");
export default {
  data() {
    return {
      imgSrc: "",
      cropImg: "",
      authToken: "",
      data: null,
      currentImage: null,
      base64data: "",
    };
  },
  components: {
    VueCropper,
  },
  props: {
    images: {
      type: Array,
      required: true,
      default: [],
    },
    currentProduct: {
      required: true,
    },
    currentImageIndex: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    async cropImage() {
      var that = this;
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      Loading.show();
      const axios = require("axios");
      await axios
        .post(`${process.env.API}/products/uploadImage`, {
          imageUrl: this.cropImg,
          imageName: `${that.currentProduct.productName}_${Date.now()}.jpeg`,
          productId: that.currentProduct._id,
          imageUrlOld: this.currentImage,
        })
        .then(function (response) {
          that.$root.$emit("cropImageEvent", {
            x: response.data.image,
            y: that.currentImage,
          });
        })
        .catch(function (error) {
          console.log(error);
        });

      Loading.hide();
      this.closeDialog();
    },
    toDataURL(src) {
      imageToBase64(src) // Path to the image
        .then((response) => {
          console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
        })
        .catch((error) => {
          console.log(error); // Logs an error if there was one
        });
    },

    async convertUrltobase64(url) {
      var that = this;
      var axios = require("axios");
      Loading.show();
      await axios
        .get(`https://api.allorigins.win/raw?url=${url}`, {
          Authorization: "Bearer " + LocalStorage.getItem("authToken"),
          responseType: "arraybuffer",
        })
        .then((response) => {
          var blob = new Blob([response.data], { type: "image/jpeg" });
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async function () {
            this.base64data = reader.result;
            Loading.hide();
            that.$refs.cropper.replace(reader.result);
          };
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  async created() {
    this.authToken = LocalStorage.getItem("authToken");
    this.currentImage = this.images[this.currentImageIndex];
    await this.convertUrltobase64(this.currentImage);
  },
};
</script>

<style scoped lang="scss">
.edit-image-dialog-card {
  min-width: 1000px;
  border-radius: 16px;
}
.content {
  display: flex;
  justify-content: space-between;
}
.cropper-area {
  max-width: 614px;
}
.preview-area {
  width: 307px;
}
.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}
.preview-area p:last-of-type {
  margin-top: 1rem;
}
.preview {
  width: 100%;
  height: calc(372px * (9 / 16));
  overflow: hidden;
  border: 2px solid black;
}
.crop-placeholder {
  width: 100%;
  height: 200px;
  background: #ccc;
}
.cropped-image img {
  max-width: 100%;
}
</style>
