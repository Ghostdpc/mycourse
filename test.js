function a(na) {
    if (na) {
        this.name = na;
    }
    console.log(this.name);
}

a.prototype.name = "aa";
a();
a("bb");
var i = new a();
var c = new a("ee");

var j = {
    c: 1,
    p: a,
};

j.p();
j.p("dd");
