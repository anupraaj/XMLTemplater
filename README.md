# XMLTemplater
A directive using Angular templating engine to create XML documents.

## Installation

Download and include the xmltemplater.js script:

    <script type="text/javascript" src="xmltemplater/xmltemplater.js"></script>

In the application, place a dependency to xml-templater:

    var app = angular.module('MyApplication', [ 'xml-templater' ]);

In the controller, use dependency to xml-helper:

    app.controller('myController', [ 'xml-helper', function(xmlHelper) {
      ....
      // do your stuff here
      ....
    }]);
    
## Usage

### XML preparation

First of all, one needs to prepare the XML to be understood by Angular's HTML engine.

Suppose we have an XML like this:

    <?xml version="1.0" encoding="UTF-8"?>
	<rowList>
		<data attributeUPPERCASE="SomeValue"></data>
		<row>
			 <cell no="1">Name 1</cell>
		</row>
		<row>
			 <cell no="1">Value 1</cell>
		</row>
		<row>
			 <cell no="1">Name 1</cell>
		</row>
		<row>
			 <cell no="1">Value 1</cell>
		</row>
	</rowList>
	
And in the Javascript code, we have an object "rows" containing two objects, like this:

    $scope.rows = [];
    $scope.rows.push({
        name : 'Name 1',
        value : 'Value 1'
    });
    $scope.rows.push({
        name : 'Name 2',
        value : 'Value 2'
    });
    $scope.rows.push({
        name : 'Name 3',
        value : 'Value 3'
    });
    
and an additional object with "SomeValue":

    $scope.exampleAttribute = "SomeValue";
    
The XML should be then prepared using "xml-element" and "xml-attribute" directives. The rowList itself
should be packed into an <xml> tag. One is free to use Angular scope and ng-repeat directives.
This element will be used to produce the <?xml?> header, therefore one may use "version" and "encoding" attributes.

    <xml version="1.0" encoding="UTF-8">
    
will transform to:

    <?xml version="1.0" encoding="UTF-8"?>

#### xml-element

The XML document has case-sensitive tags. On the contrary, HTML tags are case-insensitive and mostly
in lowercase. The xml-element directive will replace the element it is inside of with the name given.

```HTML
    <div xml-element="SOMETHING"></div>
```
    
will transform to:

    <SOMETHING></SOMETHING>
    
#### xml-attribute

As said before, the XML document is case-sensitive. Also the attributes are case-sensitive. Therefore,
the xml-attribute directive will insert a proper case sensitive attribute. Both attribute name and value
may be given.

The directive takes '|' or '=' as a separator between the name, in order to be able to process xml namespace. Therefore

    <data xml-attribute="nspc:attributeUppercase={{exampleAttribute}}"></data>
    
will transform to:

    <data nspc:attributeUppercase="_value_of_$scope.exampleAttribute_"></data>
    
So, a complete html pseudo-template, will take a form of:

    <xml version="1.0" encoding="UTF-8">
        <rowlist xml-element="rowList">
            <data xml-attribute="attributeUppercase={{exampleAttribute}}"></data>
            <row ng-repeat-start="row in rows">
                 <cell no="1">{{row.name}}</cell>
            </row>
            <row ng-repeat-end>
                 <cell no="1">{{row.value}}</cell>
            </row>
        </rowlist>
    </xml>
    
Please note the use of ng-repeat-start and ng-repeat-end directives.

## In the application:

### External template

I recommend writing own template directive for making life easier - to keep pseudo-templates
in a separate file.
The directive then may take a form of:

    app.directive('xmlTemplate', function() {
        return {
            restrict : 'A',
            scope : false,
            replace : true,
            templateUrl : 'xmltemplate.html',
            link : function(scope, element, attributes) {
            }
        }
    });

And the HTML code inside the application webpage will be:

```HTML
    <div id="xmldocument" style="display: none;" xml-template>
    </div>
```
    
Please note the display:none property - without it, the generated "something" would be visible on Your page !

### Pseudo - XML file 

A complete "xmltemplate.html" may look like this:

```HTML
  <div>
	<xml version="1.0" encoding="UTF-8">
        <rowList xml-element="rowList">
            <data xml-attribute="attribute={{exampleAttribute}}"></data>
            <row ng-repeat-start="row in rows">
                 <cell no="1">{{row.name}}</cell>
            </row>
            <row ng-repeat-end>
                 <cell no="1">{{row.value}}</cell>
            </row>
        </rowList>
    </xml>
  </div>
```
  
The "xml" is wrapped inside a div element - Angular templates may have only one root element,
and sometimes it may be useful to have multiple XML templates packed inside:

```HTML
  <div>
	<xml xml-scope="rows" version="1.0" encoding="UTF-8">
	    <rowList xml-element="rowList">
	        <data xml-attribute="attribute={{exampleAttribute}}"></data>
	        <row ng-repeat-start="row in rows">
	             <cell no="1">{{row.name}}</cell>
	        </row>
	        <row ng-repeat-end>
	             <cell no="1">{{row.value}}</cell>
	        </row>
	    </rowList>
	</xml>
	<xml version="1.0" encoding="UTF-8">
        <rowList xml-element="rowList">
            <data xml-attribute="attribute={{exampleAttribute}}"></data>
            <row ng-repeat-start="row in rows">
                 <cell no="1">{{row.name}}</cell>
            </row>
            <row ng-repeat-end>
                 <cell no="1">{{row.value}}</cell>
            </row>
        </rowList>
    </xml>
    <xml xml-scope="rows,exampleAttribute" version="1.0" encoding="UTF-8">
        <rowList>
            <data xml-attribute="attribute={{exampleAttribute}}"></data>
            <row ng-repeat-start="row in rows">
                 <cell no="1">{{row.name}}</cell>
            </row>
            <row ng-repeat-end>
                 <cell no="1">{{row.value}}</cell>
            </row>
        </rowList>
    </xml>
  </div>
```

### Final touch: getting the XML

To get the XML itself, the xml-helper factory should be used.
This factory has 2 methods: getXML() and getRawXML(). The getRawXML() method will be presented in the
final chapter. Now let's have a look at the code to retrieve XML (the $scope assignments have been skipped):

    app.controller('myController', [ '$scope', 'xml-helper', function($scope, xmlHelper) {
        var xml = xmlHelper.getXML("xmldocument");
        if (xml) {
            if (typeof xml == "string") {
                alert(xml);
            } else {
                for (var i = 0; i < xml.length; i++) {
                    alert(xml[i]);
                }
            }
        }

The getXml()  (and getRawXML() function also) requires an element or an element ID to start looking for
first <xml> tag.
This function will return a String or an array of Strings with parsed XML's.

## RAW XML USAGE

In one special case, the XML may be generated by getRawXML() function.
This special case is when the XML uses only lowercase elements. In such a case, the xml-element directive must not
be used.
In a subset of this special case, if the XML attributes are also always lowercase, the xml-attribute may be skipped.

The pseudo-XML template may take the form:

    <xml xml-scope="rows,exampleAttribute" version="1.0" encoding="UTF-8">
        <rowlist>
            <data attribute="{{exampleAttribute}}"></data>
            <row ng-repeat-start="row in rows">
                 <cell no="1">{{row.name}}</cell>
            </row>
            <row ng-repeat-end>
                 <cell no="1">{{row.value}}</cell>
            </row>
        </rowlist>
    </xml>
    
Please note the use of xml-scope directive: this directive takes a comma-separated list of $scope variables to watch
for rebuilding the DOM tree on their change. This directive must be used in order to clear out the DOM tree from Angular
classes.

The code to retrieve the XML looks like this:

    app.controller('myController', [ '$scope', 'xml-helper', function($scope, xmlHelper) {
        var xml = xmlHelper.getRawXML("xmldocument");
        if (xml) {
            if (typeof xml == "string") {
                alert(xml);
            } else {
                for (var i = 0; i < xml.length; i++) {
                    alert(xml[i]);
                }
            }
        }
        
The advantage of this method is that it will only use Angular's parser, while the getXML() method will perform
DOM tree parsing by its own.

# DEMO

Download a complete set of files and run with Chrome browser.

# License

MIT License.
