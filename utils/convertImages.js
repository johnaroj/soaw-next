export function DataUrlToFile(url, name, type) {
    return fetch(url)
        .then(res => res.arrayBuffer())
        .then(buf => {
            return new File([buf], name, { type })
        })
}

export async function ConvertImagesToFile(images) {
    if (images) {
        const im = images.map(image => {
            let typedata = image.type.split(';')[0]
            let type = typedata.split(':')[1]
            return DataUrlToFile(`${image.type},${image.base64}`, image.name, type)
        })
        const imageList = await Promise.all(im);
        return imageList
    }
    return null;

}

