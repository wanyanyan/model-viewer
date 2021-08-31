import { customAlphabet } from 'nanoid'
import * as THREE from "THREE";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";


export default {
  extend(dest, ...sources) {
    for (const src of sources) {
      for (const k in src) {
        dest[k] = src[k];
      }
    }
    return dest;
  },

  endsWith(string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
  },

  isIdExist(id, layers) {
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].id === id) {
        return true;
      }
    }
    return false;
  },

  unique(arr) {
    var res = [];
    var json = {};
    for (var i = 0; i < arr.length; i++) {
      if (!json[arr[i]]) {
        res.push(arr[i]);
        json[arr[i]] = 1;
      }
    }
    return res;
  },

  isDOM(obj) {
    if (typeof HTMLElement === "object") {
      return obj instanceof HTMLElement;
    } else {
      return (
        obj &&
        typeof obj === "object" &&
        obj.nodeType === 1 &&
        typeof obj.nodeName === "string"
      );
    }
  },

  hex2rgb(color) {
    var r = parseInt(color.substr(1, 2), 16);
    var g = parseInt(color.substr(3, 2), 16);
    var b = parseInt(color.substr(5, 2), 16);
    return new Array(r, g, b);
  },

  rgb2hex(rgb) {
    var s = "#";
    for (var i = 0; i < 3; i++) {
      var c = Math.round(rgb[i]).toString(16);
      if (c.length == 1) c = "0" + c;
      s += c;
    }
    return s;
  },

  // 将角度归一化到0-360度
  formatAngle(angle) {
    let t = angle % 360;
    if (t < 0) {
      return t + 360;
    } else {
      return t;
    }
  },

  generateId() {
    // 生成随机id
    const nanoid = customAlphabet(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
      11
    );
    return nanoid();
  },
  parseUrl(url) {
    let arr = url.split("/");
    let file = arr.pop().split('.');
    return {baseUrl: arr.join("/"), filename: file[0], filetype: file[1]};
  },
  loadGlb(url, callback) {
    new GLTFLoader().load(url, (gltf) => {
      let object = gltf.scene;
      if (callback) {
        callback(object);
      }
    });
  },

  loadObj(url, callback) {
    let {baseUrl, filename, filetype} = this.parseUrl(url)
    new MTLLoader().load(`${baseUrl}/${filename}.mtl`, function (materials) {
      materials.preload();
      new OBJLoader().setMaterials(materials).load(url, function (object) {
        if (callback) {
          callback(object);
        }
      });
    });
  },

  loadDrc(url, callback) {
    let { baseUrl, filename, filetype } = this.parseUrl(url);
    new MTLLoader().load(`${baseUrl}/${filename}.mtl`, function (materials) {
      materials.preload();
      let dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("./static/");
      dracoLoader.setDecoderConfig({ type: "js" });
      dracoLoader.load(url, (geometry) => {
        let material = materials.materials[Object.keys(materials.materials)[0]];
        let object = new THREE.Mesh(geometry, material);
        if (callback) {
          callback(object);
        }
      });
    });
  },
  createSky() {
    var skyboxUrls = [
      "./static/skyBox/skybox_px.jpg",
      "./static/skyBox/skybox_nx.jpg",
      "./static/skyBox/skybox_py.jpg",
      "./static/skyBox/skybox_ny.jpg",
      "./static/skyBox/skybox_pz.jpg",
      "./static/skyBox/skybox_nz.jpg",
    ];

    //CubeTextureLoader加载纹理图
    return new THREE.CubeTextureLoader().load(skyboxUrls);
  },
  createCamera(width, height) {
    let k = width / height;
    let s = 200;
    let camera = new THREE.PerspectiveCamera(60, k, 0.1, 500000);
    camera.position.set(100, 100, 100)
    camera.up.set(0, 0, 1);
    camera.updateMatrixWorld();
    return camera;
  },
  createRenderer(width, height) {
    let renderer = new THREE.WebGLRenderer({
      physicallyCorrectLights: true,
      logarithmicDepthBuffer: true,
      antialias: true,
      alpha: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.setSize(width, height);
    renderer.setClearColor(0x9d3ff, 1);
    return renderer;
  },
  mergeBoundingBox(bbox1, bbox2) {
    if (!bbox1) {
      return bbox2
    }
    if (!bbox2) {
      return bbox1
    }
    return {
      min: {
        x: Math.min(bbox1.min.x, bbox2.min.x),
        y: Math.min(bbox1.min.y, bbox2.min.y),
        z: Math.min(bbox1.min.z, bbox2.min.z),
      },
      max: {
        x: Math.max(bbox1.max.x, bbox2.max.x),
        y: Math.max(bbox1.max.y, bbox2.max.y),
        z: Math.max(bbox1.max.z, bbox2.max.z),
      },
    };
  }
};
