import React, { useCallback, useEffect, useRef, useState } from 'react'

import toBase64 from '../utils/to-base-64'
import {
	DirectionalLight,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

function RenderObject({ src }) {
	const frameRef = useRef(null)
	const rendererRef = useRef(null)
	const [snapshots, setSnapshots] = useState([])

	useEffect(() => {
		const scene = new Scene()
		const camera = new PerspectiveCamera(35, 1, 0.1, 100)
		const loader = new GLTFLoader()

		camera.position.set(0, 0, 10)

		loader.load(src, (gltf) => {
			const frontLight = new DirectionalLight(0x404040, 4)
			const backLight = new DirectionalLight(0x404040, 4)

			frontLight.position.set(0, 0, 10)
			backLight.position.set(10, 0, 0)

			scene.add(frontLight, backLight, gltf.scene)

			// create the renderer
			const renderer = new WebGLRenderer({
				alpha: true,
				preserveDrawingBuffer: true,
			})

			rendererRef.current = renderer

			renderer.setSize(250, 250)
			renderer.setPixelRatio(window.devicePixelRatio)
			renderer.setClearColor(0x000000, 0)

			const controls = new OrbitControls(camera, renderer.domElement)
			controls.listenToKeyEvents(window) // optional
			controls.addEventListener('change', () => renderer.render(scene, camera)) // call this only in static scenes (i.e., if there is no animation loop)
			controls.screenSpacePanning = false
			controls.maxPolarAngle = Math.PI / 2

			while (frameRef.current.firstChild) {
				frameRef.current.firstChild.remove()
			}

			frameRef.current.append(renderer.domElement)

			renderer.render(scene, camera)
		})
	}, [frameRef])

	const takeSnapshot = useCallback(async () => {
		const imageData = rendererRef.current.domElement.toDataURL()
		setSnapshots((prev) => [...prev, imageData])
		// await uploadImage(imageData)
	}, [rendererRef])

	return (
		<>
			<div ref={frameRef} />
			<button className="button button-primary" onClick={takeSnapshot}>
				Snapshot
			</button>
			{snapshots.length > 0 && (
				<div id="snapshot">
					{snapshots.map((snapshot, i) => (
						<img key={i} style={{ width: 100, height: 100 }} src={snapshot} />
					))}
				</div>
			)}
		</>
	)
}

function AssetLibrary() {
	const [uploadedFile, setUploadedFile] = useState(null)
	const fileInputRef = useRef(null)

	const showFilePicker = useCallback(() => {
		fileInputRef.current.click()
	}, [fileInputRef])

	const handleUploadedFile = useCallback(
		async (event) => {
			const file = fileInputRef.current.files[0]
			const base64 = await toBase64(file)
			setUploadedFile(base64)
		},
		[fileInputRef],
	)

	const uploadImage = useCallback(async (data) => {
		const { id: boardId } = await miro.board.info.get()
		console.log('id', boardId)

		const res = await fetch(`http://localhost:80/upload?board=${boardId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				image: data,
			}),
		}).then((res) => res.json())

		return res.imageUrl
	}, [])

	useEffect(() => {
		miro.board.ui.initDraggableItemsContainer(document.body, {
			draggableItemSelector: '#snapshot',
			getDraggableItemPreview: (targetElement) => ({
				width: 100,
				height: 100,
				url: targetElement.firstChild.src,
			}),
			onClick: async (targetElement) => {
				await miro.board.widgets.create({
					type: 'image',
					url: await uploadImage(targetElement.firstChild.src),
				})
			},
			onDrop: async (x, y, targetElement) => {
				await miro.board.widgets.create({
					x,
					y,
					type: 'image',
					url: await uploadImage(targetElement.firstChild.src),
				})
			},
		})
	}, [uploadImage])

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
