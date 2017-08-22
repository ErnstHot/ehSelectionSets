autowatch = 1;
inlets = 3;
outlets = 1;

var targetIdx = -1;
var dict = new Dict("#0ehSelectionDict");

function assist_in0() {	assist("setatrr ..., clear");}
function assist_in1() {	assist("int: store selection i");}
function assist_in2() {	assist("int: set target i"); }

setinletassist(0, assist_in0);
setinletassist(1, assist_in1);
setinletassist(2, assist_in2);

var c1 = [ 0.4, 0.4, 0.4, 1.0 ];
var c2 = [ 0.5, 0.65, 0.6, 1.0 ];
var c3 = [ 0.9, 0.4, 0.4, 1.0 ];

function updateUI()
{
	var p = this.patcher;
	var obj;

	for (var i = 0; i < 8; i++)
	{
		objSt = p.getnamed("ehssStore[" + i + "]");
		objTr = p.getnamed("ehssTarget[" + i + "]");

		objTr.activebgcolor(c1);

		if (dict.contains("idx" + i))
		{
			objTr.active(true);
			objSt.activebgcolor(c2);
		}
		else
		{
			objTr.active(false);
			objSt.activebgcolor(c1);	
		}
	}

	if (targetIdx >= 0 && targetIdx < 8)
	{
		obj = p.getnamed("ehssTarget[" + targetIdx + "]");
		obj.activebgcolor(c3); 
	}
}

updateUI();

function msg_int(idx)
{
	var p = this.patcher;
	var pp = p.parentpatcher;

	if (inlet == 1)
	{
		var p = this.patcher.parentpatcher;
		var obj = pp.firstobject;
		var oc = pp.count;

		if (dict.contains("idx" + idx))
		{
			dict.remove("idx" + idx);
		}

		while (oc--)
		{
			if (obj.selected)
			{
				dict.append("idx" + idx, obj.varname);
			}
	
			obj = obj.nextobject;
		}
		
		targetIdx = idx;
		pp.wind.dirty = true;
	}
	else if (inlet == 2)
	{
		targetIdx = idx;
		pp.wind.dirty = true;
	}

	updateUI();
}

function setattr()
{
	var pp = this.patcher.parentpatcher;
	var s = dict.get("idx" + targetIdx);
	
	if (targetIdx >= 0
		&& targetIdx < 8 
		&& s != undefined 
		&& arguments.length > 0)
	{
		str = "";
		
		for (var i = 1; i < arguments.length; i++)
		{
			str += arguments[i];
			
			if (i < arguments.length - 1)
			{
				str += ", ";
			}
		}
				
		for (var i = 0; i < s.length; i++)
		{
			var o = pp.getnamed(s[i]);

			if (o != null)
			{
				eval("o." + arguments[0] + "(" + str + ");" + "\n");
			}
		}

		pp.wind.dirty = true;			
	}
}

function clear()
{
	targetIdx = -1;
	dict.clear();
	updateUI();

	var pp = this.patcher.parentpatcher;	
	pp.wind.dirty = true;
}