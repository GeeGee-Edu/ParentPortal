# ParentPortal

a [Sails](http://sailsjs.org) application built on top of [Moodle](http://moodle.org)
---

# Installation

ParentPortal is a Node.js application, so you will have to have Node.js installed. Follow these [install instructions](https://github.com/joyent/node/wiki/installing-node.js-via-package-manager) if you don't already have it installed.

Clone the repo and install dependancies:

```
git clone "https://github.com/GeeGee-Edu/ParentPortal"
sudo npm install -g
```

### Dependancies
* [Sails.js](http://sailsjs.org/)
* [Sails-mysql]
* [Html-pdf]

# Start Server

Run `sails lift` to start the web server and access it on [http://localhost:1337](http://localhost:1337).

# Generating Report PDFs

Dad: I have not written a nice web interface for this. So you will have to use some nerd-fu to get these reports.

Type in the URL as follows. `http://localhost:1337/report/pdf?id=` followed by the id number of the cohort you want.


---
*This project is licensed under the [GPL](http://en.wikipedia.org/wiki/GNU_General_Public_License)*

ParentPortal
Copyright (C) 2015  GeeGee Edu

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
