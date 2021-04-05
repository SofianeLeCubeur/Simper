# Simper

Make all types of algorithms with a GUI, supports multiple buildpacks and dictionaries (you can make your own ones and with an API!).
Dictionaries are libraries of nodes, by default there is Basic Inputs, Math Nodes, Misc Nodes, String Nodes and Graphical Maths Nodes.
A buildpack is a set of predefined dictionaries and disposition (like a template). 

#### Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build
```

# Usage

Simper uses a node-based graphical interface. Each node has a defined number of inputs and outputs. The color of each input defines
the type of that input. Types are part of dictionaries, so each diction nary that brings its own nodes can also register
new types.

#### How to create a project

To create a new project simply hit "New Project" in the File menu. Then choose which buildpack your project will
be based on. A buildpack is a set of predefined dictionaries and disposition (like a template). You can also
import example projects or your own projects.

#### First steps

Click everywhere on the billboard to open the Node Selector, it is a simple dialog where you can type any node name. Click
on the name to add it to the billboard. You can also give custom names to nodes, when searching for a node in the
Node Selector, type the name of the node, then add a colon, then specify the name of that Node. For example: `Number:TestNode`
will create a Number Input Node named "TestNode".

Here is a screenshot of the previous statement:

![Screenshot of the Node Selector](/screenshots/SimperNodeSelector.jpg?raw=true "Node Selector")

*At the left you can see the Node Selector and below is the Number Node.
At the  right you can see the Node Selector with the name of the node, 
then the colon, then the custom Name, and below there is the Number Node named "TestNode"*
Furthermore, to illustrate types, you can see that the Number Node has one red output. In this scope,
the red represents a Number (in the backend).

#### Types of inputs

There are two types of input: the basic Input and the constant Input. Constant Inputs are inputs that can
be edited in Runtime but not when the Project is in "Run Mode". Basic Inputs are inputs that can be edited only
in the Run Mode, this inputs can also be edited by external programs or custom run profiles.

You can switch between modes in the "Build" menu. 

#### How to run a project

To run your algorithm, hit on "Run" in the "Build" menu.
You can access the console by clicking on the downwards chevron next to the "Console" label.
You can view the result of your algorithm in the Console. There are also debug logs: debug logs
are the individual steps ran by the Runtime.

#### Example projects

Here is an example of project with the MathPlan buildpack. This buildpack is used to represent math functions
as an algorithm.

![Screenshot of an example MathPlan Project](/screenshots/ExamplePrettyWave.json.png?raw=true)

Here is an example of project with the Simper buildpack (the default buildpack). You can test lots of different
algorithms with this buildpack. The required output node is a Print Node (prints in the console the given input :O).
This algorithm can generate a random floating point number between two user-defined bounds.

![Screenshot of an example Simper Project](/screenshots/ExampleRandomFloatInBounds.png?raw=true)

#### More information
The API is currently not available, but you can still create your own dictionaries and buildpacks and include it in the
sources manually. This project was initially built to create more complex Arduino sketches in a GUI style than other services.

**This Project is still WIP (Work in progress).**

Warning: Run profiles, and the edition/addition of dictionaries are not working right now.
 Dialogs still shows but nothing is done in the backend.

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[45a3e22](https://github.com/SimulatedGREG/electron-vue/tree/45a3e224e7bb8fc71909021ccfdcfec0f461f634) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).