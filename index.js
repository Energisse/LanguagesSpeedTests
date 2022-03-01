import { spawnSync } from "child_process";
import fs from "fs";
import colors from "colors";





class BaseLanguage {
    constructor(name){
        this.name = name
        console.log(colors.blue.underline(this.name))
    }

    start(command,parameters){
        const startTime = process.hrtime();
        const childProcess = spawnSync(command,parameters);
        const {stdout,stderr,error,exit} = childProcess;
        // if(stdout){
        //     console.log(`stdout: ${stdout}`);
        // };

        // if(stderr){
        //     console.log(`stderr: ${stderr}`);
        // };

        // if(error){
        //     console.log(`error: ${error}`);
        // };

        // if(exit){
        //     console.log(`exit: ${exit}`);    
        // };
        
        const precision = 3; // 3 decimal places
        const elapsed = process.hrtime(startTime)[1] / 1000000; // divide by a million to get nano to milli
        console.log(colors.green("succes: " + process.hrtime(startTime)[0] + " s, " + elapsed.toFixed(precision) + " ms  ")); // print message + time
    }

}


class Javascript extends BaseLanguage{
    constructor(file){
        super("Javascript")
        super.start("node",[file])
    }
}


class Python extends BaseLanguage{
    constructor(file){
        super("Python")
        super.start("python3",[file])

    }
}

class CPlusPlus extends BaseLanguage{
    constructor(file){
        super("C++")
        let destination =  
        file.split("/").map((element,index,{length})=>{
            if(index === length-1){
                return element.split(".").at(0)+'.o'
            }
            return element
        }).join("/");
        

        const compiler = "gcc";
        console.log(colors.blue("Compiling..."))
        spawnSync(compiler,[file,"-o",destination]);
        fs.chmodSync(destination,"777")
        console.log(colors.blue("Compiling done"))
        super.start(destination)
        fs.unlinkSync(destination)

    }
}


class C extends BaseLanguage{
    constructor(file){
        super("C")
        let destination =  
        file.split("/").map((element,index,{length})=>{
            if(index === length-1){
                return element.split(".").at(0)+'.o'
            }
            return element
        }).join("/");
        

        const compiler = "gcc";
        console.log(colors.blue("Compiling..."))
        spawnSync(compiler,[file,"-o",destination]);
        fs.chmodSync(destination,"777")
        console.log(colors.blue("Compiling done"))
        super.start(destination)
        fs.promises.unlink(destination)

    }
}


class Php extends BaseLanguage{
    constructor(file){
        super("Php")
        super.start("php",[file])
    }
}




const testFoldersName = "speedTests";
const languages = new Map();
languages.set("js",Javascript);
languages.set("c++",CPlusPlus);
languages.set("c",C);
languages.set("py",Python);
languages.set("php",Php)

const readTestFolders = (err, testsFolders) => {
    if(err){
        console.log(colors.bold.red(`Folder for testing (${testFoldersName}) doesn't exist`));
        return;
    }
    
    testsFolders.forEach((testFolderName) => {
        console.log(colors.bold.blue(testFolderName))


        let testFiles;
        try{
            testFiles = fs.readdirSync(`./${testFoldersName}/${testFolderName}`);
        }
        catch(error){
            console.log(colors.bold.red(`The test Folder (${testFolderName}) cannot be read`))
            return;
        }
       
        const config = readConfigFile(`./${testFoldersName}/${testFolderName}`)
        testFiles=testFiles.filter(file=>file!=="config.json")
        
        let parameters = ""
        if(config.parameters){

            Object.entries(config.parameters).forEach(([key, value])=>{
                parameters+=key+"="+value+","
            })
            parameters = parameters.slice(0,-1);
            console.log(colors.blue(parameters))
            
        }
        testFiles.forEach((testFile) => {
            const language = testFile.split(".").at(-1);
            
            if(languages.has(language)){
                let path = `./${testFoldersName}/${testFolderName}/${testFile}`
                if(config.parameters){
                    let file = fs.readFileSync(path).toString()

                    Object.entries(config.parameters).forEach(([key, value])=>{
                        file = file.replace("{{"+key+"}}",value)
                    })
                    path = `./${testFoldersName}/${testFolderName}/compiled-${testFile}`
                    fs.writeFileSync(path,file);
                    
                }
                new (languages.get(language))(path)
                fs.promises.unlink(`./${testFoldersName}/${testFolderName}/compiled-${testFile}`).catch(()=>{})
            }
            else{
                console.log(colors.bold.red(`cannot execute ${testFile} extension not supported`));  
            }
        });

    });
}

const readConfigFile = (fodler) => {
    try {
        return JSON.parse(fs.readFileSync(fodler+"/config.json").toString())
    } catch (err) {
        const name = fodler.split("/").at(-1);
        console.log(colors.yellow(`The test Folder (${name}) doesn't have a config.json file`));
        return {
            name:name
        }
    }
}

fs.readdir(`./${testFoldersName}`,readTestFolders);



    

    



