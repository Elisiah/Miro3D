import * as React from 'react'
import ReactDOM from 'react-dom'

async function init() {
	const [sticker] = await miro.board.widgets.create({
		type: 'sticker',
		text: 'Hello, World!',
	})

	await miro.board.viewport.zoomToObject(sticker)
}

function App() {
	React.useEffect(() => {
		init()
	}, [])
}

ReactDOM.render(<App />, document.getElementById('root'))
