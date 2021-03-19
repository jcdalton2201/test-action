const fetch = require('node-fetch');
var fs = require('fs');
const mkdirp = require('mkdirp');
var sourceMapFireFox = require('source-map');
var lineColumn = require('line-column');
class V8ToCoverage {
    constructor() {

    }
    set baseDir(_value) {
        this._baseDir = _value;
    }
    /**
     * 
     * @param {*} source 
     * @param {*} compairMap 
     * @param {*} v8Map 
     * @param {*} i 
     */
    addV8File(source, compairMap, v8Map, i) {
        const lines = compairMap.sourceContentFor(source).split('\n').length;
        let temp = {};
        let previous = 0;
        for (let index = 1; index <= lines; index++) {
            let end = 0;
            if (index !== lines) {
                end = lineColumn(compairMap.sourceContentFor(source)).toIndex(index + 1, 1);
            } else {
                end = compairMap.sourceContentFor(source).length + 1;
            }

            temp[index - 1] = {
                start: {
                    line: index,
                    column: 0
                },
                end: {
                    line: index,
                    column: end - previous - 1
                }
            };
            previous = end;
        }
        v8Map[source] = {
            scriptId: i,
            url: `file://${this._baseDir}/.nyc_output/js/${source.replace('../', '')}`,
            statementMap: temp,
            lines: lines,
            source: compairMap.sourceContentFor(source),
            functions: [{
                ranges: [],
                isBlockCoverage: true,
            }]
        };

    }
    /**
     * 
     * @param {Array} ranges 
     */
    buildStatment(jsFile) {
        jsFile.url.replace('file://', '');
        
        const ranges = jsFile.functions[0].ranges;
        const lines = jsFile.lines;
        let statement = {};
        for (let index = 0; index < lines; index++) {
            statement[index] = 0;
        }
        ranges.forEach((range) => {
            const posStart = lineColumn(jsFile.source).fromIndex(range.startOffset);
            let posEnd = lineColumn(jsFile.source).fromIndex(range.endOffset);
            if (!posEnd) {
                posEnd = {
                    line: jsFile.lines
                };
            }
            let rangeStart = posStart.line ;
            let rangeEnd = posEnd.line;
            if(posEnd.col === 1){
                rangeEnd = rangeEnd - 1;
            }
            for (let index = rangeStart; index < rangeEnd + 1; index++) {
                
                statement[index - 1] = 1;
            }
        });
        
        //check to see if we have a headers or seting customeElements
        Object.values(jsFile.statementMap).forEach((row) => {
            let startPos = lineColumn(jsFile.source).toIndex(row.start.line, row.start.column+1);
            let endPos = lineColumn(jsFile.source).toIndex(row.end.line, row.end.column);
            const rowString = jsFile.source.substring(startPos, endPos);
            if(parseInt(startPos) < 0){
                startPos = 0;
            }
            if(parseInt(endPos) < 0){
                endPos = startPos;
            }
            const imporRex = /import /g;
            if (rowString.match(imporRex)) {
                statement[row.end.line - 1] = 1;
            }
            if (rowString.includes(' class ')) {
                statement[row.end.line - 1] = 1;
            }
            if (rowString.includes('!customElements.get')) {
                statement[row.end.line - 1] = 1;
            }
            if (rowString.includes(' customElements.define')) {
                statement[row.end.line - 1] = 1;
                statement[row.end.line] = 1;
            }
            // rowString.trim();
            // if (rowString === '') {
            //     statement[row.end.line - 1] = 1;
            // }
        });
        return statement;
    }
    /**
     * 
     * @param {URL|String} source 
     */
    async getSouceMap(source = '') {
        if(source.startsWith('http')){
            const res = await fetch(source);
            const data = await res.json();
            this.writeFiles(data);
            return data;
        } else {
            const data =  JSON.parse(fs.readFileSync(this._baseDir+source.substring(0,source.indexOf('\n')),'utf8'));
            this.writeFiles(data);
            return data;
        }
    }
    /**
     * 
     * @param {String} sourceMap 
     */
    writeFiles(sourceMap) {
        sourceMap.sources.forEach((item, index) => {
            if (!item.includes('node_modules')) {
                const filePath = `.nyc_output/js/${item}`.replace('../', '');
                if (!fs.existsSync(filePath.substring(0, filePath.lastIndexOf('/')))) {
                    mkdirp.sync(filePath.substring(0, filePath.lastIndexOf('/')));
                }
                fs.writeFileSync(filePath, sourceMap.sourcesContent[index]);
            }

        });
    }
    traverseSourceBackwards(text,end){
        let orgPosEnd = lineColumn(text).fromIndex(end -1);
        if(orgPosEnd === null){
            orgPosEnd = this.traverseSourceBackwards(text,end -1);
        }
        return orgPosEnd;
    }
    traverseGeneratedBackward(compairMap,text,end){
        let orgPosEnd = lineColumn(text).fromIndex(end -1);
        let sourcePosEnd = compairMap.originalPositionFor({ line: orgPosEnd.line, column: orgPosEnd.col });
        if(sourcePosEnd.source === null){
            sourcePosEnd = this.traverseGeneratedBackward(compairMap,text,end -1);
        }
        return sourcePosEnd;
    }
    /**
     * 
     * @param {Array<String>} files 
     * @param {String} sourceMap 
     */
    async buildV8Map(file) {
        const v8Map = {};
        let i = 0;
        const compairMap = await new sourceMapFireFox.SourceMapConsumer(file.sourceFile);
        const filesources = file.sourceFile.sources;

        file.ranges.forEach((range) => {
            
            const orgPosStart = lineColumn(file.text).fromIndex(range.start);
            let orgPosEnd = lineColumn(file.text).fromIndex(range.end);
            if(orgPosEnd === null){
                orgPosEnd = this.traverseSourceBackwards(file.text,range.end);
            }
            
            const sourcePosStart = compairMap.originalPositionFor({ line: orgPosStart.line, column: orgPosStart.col });
            let sourcePosEnd = compairMap.originalPositionFor({ line: orgPosEnd.line, column: orgPosEnd.col });
        
            if(sourcePosEnd.source === null){
                sourcePosEnd = this.traverseGeneratedBackward(compairMap,file.text,range.end);
            }
            const sIndex = lineColumn(compairMap.sourceContentFor(sourcePosStart.source)).toIndex(sourcePosStart.line, sourcePosStart.column);
            const eIndex = lineColumn(compairMap.sourceContentFor(sourcePosEnd.source)).toIndex(sourcePosEnd.line, sourcePosEnd.column);
            if (sourcePosStart.source !== sourcePosEnd.source) {
                const arrayEnd = filesources.indexOf(sourcePosEnd.source);
                const arrayStart = filesources.indexOf(sourcePosStart.source);
                if (arrayEnd - arrayStart > 1) {
                    for (let x = arrayStart + 1; x < arrayEnd; x++) {
                        this.addV8File(filesources[x], compairMap, v8Map, i);
                        v8Map[filesources[x]].functions[0].ranges.push({
                            startOffset: 0,
                            endOffset: compairMap.sourceContentFor(filesources[x]).length - 1,
                            count: 1
                        });
                        i = i + 1;
                    }

                }
                //set first file
                if(!v8Map[sourcePosStart.source]){
                    this.addV8File(sourcePosStart.source, compairMap, v8Map, i);
                }
                v8Map[sourcePosStart.source].functions[0].ranges.push({
                    startOffset: sIndex,
                    endOffset: compairMap.sourceContentFor(sourcePosStart.source).length,
                    count: 1
                });
                i = i + 1;
                //set the begining of the last file.
                this.addV8File(sourcePosEnd.source, compairMap, v8Map, i);
                v8Map[sourcePosEnd.source].functions[0].ranges.push({
                    startOffset: 0,
                    endOffset: eIndex,
                    count: 1
                });
                i = i + 1;
            } 
            if (!v8Map[sourcePosStart.source]) {
                this.addV8File(sourcePosStart.source, compairMap, v8Map, i);
                i = i + 1;
            }
            if (eIndex > sIndex) {
                v8Map[sourcePosStart.source].functions[0].ranges.push({
                    startOffset: sIndex,
                    endOffset: eIndex,
                    count: 1
                });
            }
        });
        const fileMap = Object.values(v8Map).filter(item => !item.url.includes('node_modules'));

        await this.writeIstanbulFormat(fileMap);
        return fileMap;
    }
    async write(file){
        const mappingIndex = file.text.lastIndexOf('//# sourceMappingURL=') + 21;
        const fileLocation = file.text.substring(mappingIndex);
        const hostString = file.url.substring(0,file.url.lastIndexOf('/')+1);
        file.sourceFile = await this.getSouceMap(hostString+fileLocation);
        await this.buildV8Map(file);
    }
    /**
     * 
     * @param {*} puppeteerToV8Info 
     */
    writeIstanbulFormat(puppeteerToV8Info) {
        var fullJson = {};
        puppeteerToV8Info.forEach(jsFile => {
            const path = jsFile.url.replace('file://', '');
            
            fullJson[path] = {
                path: path,
                statementMap: jsFile.statementMap,
                s: this.buildStatment(jsFile),
                branchMap: {},
                b: {},
                fnMap: {},
                f: {}
            };
        });
        if(Object.keys(fullJson).length > 0){
            fs.writeFileSync('./.nyc_output/out.json', JSON.stringify(fullJson), 'utf8');
        }
    }
}

module.exports = new V8ToCoverage();