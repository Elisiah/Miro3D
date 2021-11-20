import React from 'react'
import ReactDOM from 'react-dom'
import AssetLibrary from './components/asset-library'

function App() {
	return (
		<div className="grid wrapper">
			<div className="cs1 ce12">
				<AssetLibrary />
			</div>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('root'))
