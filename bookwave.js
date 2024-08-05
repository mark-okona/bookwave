const sections = document.querySelectorAll("section")

sections.forEach(section => {

  const originalImage = section.querySelector("img")
  const originalImageSource = originalImage.getAttribute("src")

  section.innerHTML = ""

  const app = new PIXI.Application({

    width: 1100,
    height: 800,
    transparent: true

  })

  section.appendChild(app.view)

  let image = null
  let displacementImage = null
  let rgbFilter = new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0])

  const loader = new PIXI.loaders.Loader()
  loader.add("displacement", "assets/displacement1.jpg")
  loader.add("image", originalImageSource)

  loader.load((loader, resources) => {

    image = new PIXI.Sprite(resources.image.texture)
    displacementImage = new PIXI.Sprite(resources.displacement.texture)

    image.x = 100 + 450
    image.y = 100 + 300
    image.width = 900
    image.height = 600
    image.interactive = true

    image.anchor.x = 0.5
    image.anchor.y = 0.5

    displacementImage.width.x = 600
    displacementImage.height.y = 600
    displacementImage.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT

    image.filters = [
      // new PIXI.filters.BlurFilter(5, 5),
      // new PIXI.filters.NoiseFilter(0.1)
      new PIXI.filters.DisplacementFilter(displacementImage, 20),
      rgbFilter
    ]

    app.stage.addChild(image)
    app.stage.addChild(displacementImage)

    // app.ticker.add(() => {
    //   displacementImage.x += 1
    // })

  })

  let currentX = 0
  let currentY = 0
  let aimX = 0
  let aimY = 0

  section.addEventListener("mousemove", (e) => {

    aimX = e.pageX
    aimY = e.pageY

  })

  const animate = () => {

    const diffX = aimX - currentX
    const diffY = aimY - currentY

    currentX = currentX + (diffX * 0.05)
    currentY = currentY + (diffY * 0.05)

    if (displacementImage) {
      displacementImage.x = currentX
      displacementImage.y = displacementImage.y + 5 + (diffY * 0.1)

      rgbFilter.red = [diffX * 0.1, 0]
      rgbFilter.green = [0, diffY * 0.1]
      rgbFilter.blue = [diffY * 0.1, 0]
    }

    requestAnimationFrame(animate)

  }

  animate()

})
