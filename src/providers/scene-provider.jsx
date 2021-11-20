import { Scene } from 'three'
import React from 'react'

const SceneContext = React.createContext(null)

function SceneProvider({ children }) {
	return (
		<SceneContext.Provider value={new Scene()}>
			{children}
		</SceneContext.Provider>
	)
}

export default SceneProvider
