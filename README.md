# Technical Exercise

The original project can be found here : [GitHub repo](https://github.com/fyears/electron-python-example).

## Description
This repository conatains the source code for the technical exercise. The electron app showcased here takes in two numbers and returns the sum of the two numbers. 

### Setup
We need the python application, `python`, `pip`, `node`, `npm`, available in command line. For using `zerorpc`, we also need the C/C++ compilers (`cc` and `c++` in the command line, and/or MSVC on Windows).

```text
.
|-- index.html
|-- main.js
|-- package.json
|-- renderer.js
|-- tests
|   |-- app.test.js
|-- pysum
|   |-- api.py
|   |-- sum.py
|   `-- requirements.txt
|
|-- LICENSE
`-- README.md
```

#### Python
To run this app, the [`zerorpc`](https://www.zerorpc.io/) python module is required. Python virtual environment is strongly suggested for installing applications. The instructions for setting up such an environment can be found [`here`](https://docs.python.org/3/tutorial/venv.html).
To work off the run time itself, you also need [`pyinstaller`](https://pyinstaller.readthedocs.io/en/stable/installation.html) to package the python code.

```bash
pip install zerorpc
pip install pyinstaller

# for windows only
pip install pypiwin32 # for pyinstaller
```
#### Node.js
##### Dependencies
Since versions matter, I am listing the versions of all node.js modules required here. This can also be found in [`package.json`](https://github.com/megasanjay/technical_exercise/blob/master/package.json) if you clone the repository. 
- bootstrap@4.5.3
- electron@1.8.8
- electron-connect@0.6.3
- electron-packager@15.1.0
- gulp@4.0.2
- jest@26.6.1
- jquery@1.9.1 - 3
- nodemon@2.0.6
- popper.js@1.16.1
- spectron@3.8.0
- zeromq@5.2.0
- zerorpc@0.9.8

If you have any issues with the project, I recommend reinstalling the node packages. Detailed instructions can be found in the original repository linked at the top of this document.

Clean the caches before reinstalling any node packages.

```bash
# On Linux / OS X
# clean caches, very important!!!!!
rm -rf ~/.node-gyp
rm -rf ~/.electron-gyp
rm -rf ./node_modules
```

```powershell
# On Window PowerShell (not cmd.exe!!!)
# clean caches, very important!!!!!
Remove-Item "$($env:USERPROFILE)\.node-gyp" -Force -Recurse -ErrorAction Ignore
Remove-Item "$($env:USERPROFILE)\.electron-gyp" -Force -Recurse -ErrorAction Ignore
Remove-Item .\node_modules -Force -Recurse -ErrorAction Ignore
```
Install the electron version required for this project and verify the version installed.

```bash
# check out the version value in your package.json
npm install --runtime=electron --target=1.8.8

# verify the electron binary and its version by opening it
./node_modules/.bin/electron
```
I also needed to rebuild the zeromq module. If you see any errors on your dev console regarding incompatible versions, give [this](https://github.com/zeromq/zeromq.js/tree/5.x) a try.

```bash
npm install zeromq@5
npm rebuild zeromq --runtime=electron --target=1.8.8
```

If you have issues with the above steps I recommend checking [this](https://github.com/fyears/electron-python-example/blob/master/README.md#optional-building-from-sources) out for rebuilding from sources.

#### Testing the Python server
To check that everything was installed correctly, run `python pysum/api.py` in one terminal. Then ***open another terminal***, run this command and see the result:

```bash
zerorpc tcp://localhost:4242 sum '{ "input1":3, "input2":2}'
## connecting to "tcp://localhost:4242"
## 5
```

After debugging, **remember to terminate the Python function**.

#### Testing the Electron app

You can run the project with

```bash
npm start
```
or
```bash
./node_modules/.bin/electron .
```

If something like dynamic linking errors shows up, try to clean the caches and install the libraries again.

```bash
rm -rf node_modules
rm -rf ~/.node-gyp ~/.electron-gyp

npm install
```

### Testing

The original repository does not delve into testing the app but I used [`Spectron`](https://www.electronjs.org/spectron) with [`Jest`](https://jestjs.io/docs/en/getting-started) to run end to end tests for the current app. An anomaly that occured on my end when I was trying to run the tests on my macOS system. For some reason the Jest runtime would bring up the devtools when opening the app and invalidate the `getWindowCount()` Spectron function call. I did all my testing on Windows and this behaviour could not be replicated. I could also not replicate it on the macOS packaged app.

To run the tests you can just use the included script in [`package.json`](https://github.com/megasanjay/technical_exercise/blob/master/package.json).
```bash
npm test
```

### Packaging the app
#### pyinstaller
Use [PyInstaller](http://www.pyinstaller.org/).

Run the following in the terminal:

```bash
pyinstaller pysum/api.py --distpath pysumdist

rm -rf build/
rm -rf api.spec
```

If everything goes well, the `pysumdist/api/` folder should show up, as well as the executable inside that folder. This is the complete independent Python executable that could be moved to somewhere else.

#### electron-packager

run [`electron-packager`](https://github.com/electron-userland/electron-packager) to generate the bundled application. We also want to exclude some folders (For example, `pycalc/` is no longer needed to be bundled). The name, platform, and arch are inferred from `package.json`. For more options, check out the docs.

```bash
.\node_modules\.bin\electron-packager . --overwrite --ignore="pysum$" --ignore="\.venv" --prune=true --out=release-builds --version-string.ProductName="Technical Exercise"
##ackaging app for platform win32 x64 using electron v1.8.8
##Wrote new app to release-builds\technical-exercise-win32-x64
```

You should be able to now move the generated folder to anywhere on your file system and run it. It does generate a large file (around 240MB in my case) but 7zip was able to bring it to about 70MB
