function toBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		console.log('123123')
		reader.readAsDataURL(file)
		console.log('123123')
		reader.onload = () => {
			console.log('123123')
			resolve(reader.result)
		}
		console.log('123123')
		reader.onerror = (error) => reject(error)
	})
}

export default toBase64
