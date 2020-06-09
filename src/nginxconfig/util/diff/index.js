/*
Copyright 2020 DigitalOcean

This code is licensed under the MIT License.
You may obtain a copy of the License at
https://github.com/digitalocean/nginxconfig.io/blob/master/LICENSE or https://mit-license.org/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions :

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import escape from 'escape-html';
import renames from './renames';
import confLines from './conf_lines';
import names from './names';

export default (newConf, oldConf) => {
    // Consider renames
    const renameMap = renames(newConf, oldConf);

    // Store the diff config files
    const newFiles = {};

    // Work through each file in the new config
    for (const name in newConf) {
        if (!Object.prototype.hasOwnProperty.call(newConf, name)) continue;

        let newFileName = escape(name);
        let newFileConf = escape(newConf[name]);

        // If this file was in the old config (same name or renamed & similar)
        // Calculate the diff of the configs
        const old = oldConf && oldConf[renameMap[name]];
        if (old && old !== newConf[name]) {
            console.info(`Diffing ${name}...`);
            newFileConf = confLines(newConf[name], old);
        }

        // If the file was renamed we should diff that too
        if (name in renameMap && renameMap[name] !== name) {
            newFileName = names(name, renameMap[name]);
        }

        // Store!
        newFiles[name] = [
            newFileName,
            newFileConf,
        ];
    }

    // Done
    return newFiles;
};
