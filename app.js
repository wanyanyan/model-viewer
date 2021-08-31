import ModelViewer from "./src"

function init() {
  window.viewer = new ModelViewer({
    container: "map",
    type: "modelset",
    url: "./static/model/metadata.json",
    axisHelper: false
  });
}

window.onload = () => {
  init()
}