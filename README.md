# Miro3D

Miro 3D is an application plugin for Miro.com which allows 3d objects to be loaded as gltf or glb files.

Miro is a multi-user digital collaborative artboard allowing teams to plan and create 'the next big thing'. The current
toolset only supports 2d objects, and we believe this is restricting, by adding 3 dimensional functionality we allow
more complex ideas to be conveyed in an easier to understand and less messy way.

## Brief intro

## What it does

Currently, the plugin can render the uploaded `.gib`/ `.gltt` file into a 3D object in the sidebar. The user can rotate
the 3D model, and take "snapshots" of it which generates images of the 3D model at that angle. The users can then drag
the generated snapshots into the canvas, so that users can compare and comment on a 3D model.

## What it will do

The plan is to be able to render the 3D model directly in the canvas. Due to current API limitation, this is not
possible at the moment, which is why we made a compromise on the feature of the plugin, but the code to achieve such
feature is already in place. If future API updates allow such extension, that part of the code will be enabled.
