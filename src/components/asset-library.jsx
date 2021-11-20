import React, { useCallback, useEffect, useRef, useState } from 'react'

import toBase64 from '../utils/to-base-64'
import {
	DirectionalLight,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function RenderObject({ src }) {
	const frameRef = useRef(null)

	useEffect(() => {
		const scene = new Scene()
		const camera = new PerspectiveCamera(35, 1, 0.1, 100)
		const loader = new GLTFLoader()

		camera.position.set(0, 0, 10)

		loader.load(src, (gltf) => {
			const mainLight = new DirectionalLight(0xffffff, 4)

			mainLight.position.set(0, 10, 10)

			scene.add(mainLight, gltf.scene)

			// create the renderer
			const renderer = new WebGLRenderer({
				alpha: true,
			})

			renderer.setSize(100, 100)
			renderer.setPixelRatio(window.devicePixelRatio)
			renderer.setClearColor(0x000000, 0)

			while (frameRef.current.firstChild) {
				frameRef.current.firstChild.remove()
			}

			frameRef.current.append(renderer.domElement)

			renderer.render(scene, camera)
		})
	}, [frameRef])

	return <div ref={frameRef} />
}

function AssetLibrary() {
	const [uploadedFile, setUploadedFile] = useState(null)
	const fileInputRef = useRef(null)

	const showFilePicker = useCallback(() => {
		fileInputRef.current.click()
	}, [fileInputRef])

	const handleUploadedFile = useCallback(async (event) => {
		const file = fileInputRef.current.files[0]
		const base64 = await toBase64(file)
		setUploadedFile(base64)
	}, [])

	return (
		<div>
			<input
				ref={fileInputRef}
				type="file"
				style={{ display: 'none' }}
				onChange={handleUploadedFile}
			/>
			<button className="button button-primary" onClick={showFilePicker}>
				Upload
			</button>
			{uploadedFile && <RenderObject src={uploadedFile} />}
		</div>
	)
}

export default AssetLibrary
