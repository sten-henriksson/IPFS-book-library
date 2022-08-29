function creattag(pathString) {
    console.log("path", pathString);
    const path = pathString.split("/")
    let tags = []
    let tagStart = false
    let depth = process.env.TAG_DEPTH || 0
    for (let index = 0; index < path.length; index++) {
      const element = path[index];
      if (element == process.env.TAGSTART) {
        tagStart = true
      }
      if (tagStart) {
  
        if (depth < 3) {
          tags.push(element)
          depth++;
        }
      }
    }
    return tags.join("/");
  }