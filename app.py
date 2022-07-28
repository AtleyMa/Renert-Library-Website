from __future__ import division
from operator import floordiv
from flask import Flask, jsonify, redirect, render_template, request, session
from flask_sqlalchemy import SQLAlchemy
from pprint import pprint
from flask_wtf import FlaskForm
from sqlalchemy import null, text, insert
from sqlalchemy.types import NVARCHAR
from wtforms import IntegerField, StringField, SubmitField,TextAreaField, SelectMultipleField
from wtforms.validators import DataRequired, Optional
from flask_bootstrap import Bootstrap

app = Flask(__name__)

app.config['WTF_CSRF_ENABLED'] = False
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://audrey:2@renert.docs:5433/school'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///renert-library.db'
db = SQLAlchemy(app)
b = Bootstrap(app)

def add_tags(tag_name, tag_def):
    sql = "insert into library_tags (tag_name, description, created_by) values ('" + str(tag_name) + "','" + str(tag_def) + "', 22)"
    db.session.execute(sql)
    db.session.commit()

def change_book(ren_id, book_name, author, notes):
    if (book_name == ""):
        book_name = db.session.execute("select title from library_books where renert_id = '" + str(ren_id) + "'")
        book_name = [dict(x) for x in book_name]
        book_name = book_name[0]["title"]
    if (author == ""):
        author = db.session.execute("select author from library_books where renert_id = '" + str(ren_id) + "'")
        author = [dict(x) for x in author]
        author = author[0]["author"]
    if (notes == ""):
        notes = db.session.execute("select notes from library_books where renert_id = '" + str(ren_id) + "'")
        notes = [dict(x) for x in notes]
        notes = notes[0]["notes"]
    sql = "update library_books set title = '" + str(book_name) + "' , author = '" + str(author) + "', notes = '" + str(notes) + "' where renert_id = '" + str(ren_id) + "'"
    db.session.execute(sql)
    db.session.commit()

def remove_btag(tag_id):
    sql = "delete from library_books_tags where tag_id = '" + str(tag_id) +"'"
    db.session.execute(sql)
    db.session.commit()

def apply_tags(book_id, tag_id, tag_name):
    if (tag_id == -1 and tag_name != ""):
        tag_id = db.session.execute("select tag_id from library_tags where tag_name = '" + str(tag_name) + "'")
        tag_id = [dict(x) for x in tag_id]
        tag_id = tag_id[0]["tag_id"]
    sql = "insert into library_books_tags (book_id, tag_id) values ('" + str(book_id) + "','" + str(tag_id) + "')"
    db.session.execute(sql)
    db.session.commit()

class edit_book_form(FlaskForm):
    ren_id = IntegerField('Renert Book Id: ', validators=[DataRequired()])
    book_name = StringField('Book Name: ', validators=[])
    author = StringField('Author: ', validators=[])
    notes = TextAreaField('Notes: ', validators=[])
    edit = SubmitField("Edit", validators=[DataRequired()])

class add_tag_form(FlaskForm):
    tag_name = StringField('Tag Name: ', validators=[DataRequired()])
    tag_def = TextAreaField('Tag Description: ', validators=[DataRequired()])
    add = SubmitField("Add", validators=[DataRequired()])

class remove_btag_form(FlaskForm):
    tag_id = IntegerField('Tag Id: ', validators=[DataRequired()])
    remove = SubmitField("Delete", validators=[DataRequired()])

class apply_btag_form(FlaskForm):
    book_id = IntegerField('Book Id: ', validators=[])
    tag_id = IntegerField('Tag Id: ', validators=[Optional()])
    tag_name = StringField('Tag Name: ', validators=[])
    apply_btag = SubmitField("Apply", validators=[DataRequired()])

@app.route("/", methods=["GET", "POST"])
def main():
    return render_template("main.html")

@app.route("/tags", methods=["GET", "POST"])
def tags():
    add_tag = add_tag_form()

    if add_tag.validate_on_submit():
        add_tags(add_tag.tag_name.data, add_tag.tag_def.data)
    else:
        pprint("failed")
    
    tags = db.session.execute("select * from library_tags")
    tags = [dict(x) for x in tags]
    count =db.session.execute("select count(*) from library_tags")
    count = [dict(x) for x in count]
    return render_template("tags.html", tags=tags, add_form=add_tag, count=count[0]["count(*)"])

@app.route("/tag/<int:id>", methods=["GET", "POST"])
def tag(id):
    tag = db.session.execute("select tag_name, description, created_by, created_at, updated_at from library_tags where tag_id = '" + str(id) + "'")
    tag = [dict(x) for x in tag]
    books = db.session.execute("select library_books.title, library_books.author, library_books.renert_id from library_books_tags inner join library_books on library_books_tags.book_id = library_books.id where library_books_tags.tag_id = '" + str(id) + "'")
    books = [dict(x) for x in books]
    return render_template("tag.html", tag=tag, id=id)

@app.route("/book-tags", methods=["GET", "POST"])
def bookTags():
    bookTags = db.session.execute("select * from library_books")
    bookTags = [dict(x) for x in bookTags]
    return render_template("booksTag.html", bookTags=bookTags)

@app.route("/book/<string:id>", methods=["GET", "POST"])
def book(id):
    edit_book = edit_book_form()
    apply_tag = apply_btag_form()
    remove_tag = remove_btag_form()
    
    edit_book.ren_id.data = id
    apply_tag.book_id.data = id
    if (apply_tag.is_submitted()):
        if apply_tag.tag_id.data == None:
            apply_tag.tag_id.data = -1

    if edit_book.validate_on_submit():
        print("EDIT-BOOK mode")
        change_book(edit_book.ren_id.data, edit_book.book_name.data, edit_book.author.data, edit_book.notes.data)
  
    if apply_tag.validate_on_submit():
        print("Apply-Form is Valid")
        apply_tags(apply_tag.book_id.data, apply_tag.tag_id.data, apply_tag.tag_name.data)
    else:
        print("Apply Form - Not submitted or not valid")

    if remove_tag.validate_on_submit():
        remove_btag(remove_tag.tag_id.data)
    
    book = db.session.execute("select id, title, author, created_at, updated_at from library_books where renert_id = '" + str(id) + "'")
    book = [dict(x) for x in book]
    tags = db.session.execute("select library_tags.tag_id, library_tags.tag_name, library_tags.description from library_tags inner join library_books_tags on library_tags.tag_id = library_books_tags.tag_id inner join library_books on library_books_tags.book_id = library_books.id where library_books.renert_id = '" + str(id) + "'")
    tags = [dict(x) for x in tags]
    return render_template("book.html", book=book, tags=tags, edit_form=edit_book, id=id, apply_tag=apply_tag, remove_tag=remove_tag)

@app.route("/author/<string:a>", methods=["GET", "POST"])
def author(a):
    author = db.session.execute("select * from library_books where author = '" + str(a) + "'")
    author = [dict(x) for x in author]
    return render_template("author.html", author=author, a=a)

@app.route("/browse", methods=["GET", "POST"])
def browse():
    books = db.session.execute("select * from library_books")
    books = [dict(x) for x in books]
    tags = db.session.execute("select * from library_tags")
    tags = [dict(x) for x in tags]
    return render_template("browse.html", books=books, tags=tags)

@app.route("/authors/<string:a>", methods=["GET", "POST"])
def authorB(a):
    authors = db.session.execute("select * from library_books where author = '" + str(a) + "'")
    authors = [dict(x) for x in authors]
    return render_template("authorB.html", authors=authors, a=a)

@app.route("/books/<string:id>", methods=["GET", "POST"])
def bookB(id):
    book = db.session.execute("select title, author, notes, created_at, updated_at from library_books where renert_id = '" + str(id) + "'")
    book = [dict(x) for x in book]
    tags = db.session.execute("select library_tags.tag_id, library_tags.tag_name, library_tags.description from library_tags inner join library_books_tags on library_tags.tag_id = library_books_tags.tag_id inner join library_books on library_books_tags.book_id = library_books.id where library_books.renert_id = '" + str(id) + "'")
    tags = [dict(x) for x in tags]
    return render_template("bookB.html", book=book, tags=tags, id=id)

@app.route("/created-by/<int:id>", methods=["GET", "POST"])
def createdBy(id):
    created = db.session.execute("select tag_name, description from library_tags where created_by = '" + str(id) + "'")
    created = [dict(x) for x in created]
    return render_template("createdBy.html", created=created, id=id)

deleted_tag_all = [[]]
deleted_book_tags_all = [[]]
deleted_book_all = [[]]
deleted_tags_all = [[]]

deleted_tag = []
deleted_book_tags = []
@app.route("/tagDelete/<int:id>", methods=["GET", "POST"])
def tagDelete(id):
    sql3 = "select * from library_tags where tag_id = '" + str(id) + "'"
    sql3 = db.session.execute(sql3)
    sql3 = [dict(x) for x in sql3]
    global deleted_tag
    deleted_tag += sql3
    deleted_tag_all.append(deleted_tag)

    sql1 = "delete from library_tags where tag_id = '" + str(id) + "'"

    sql2 = "select book_id from library_books_tags where tag_id = '" + str(id) + "'"
    sql2 = db.session.execute(sql2)
    sql2 = [dict(x) for x in sql2]

    sql = "delete from library_books_tags where tag_id = '" + str(id) + "'" 

    db.session.execute(sql)
    db.session.execute(sql1)

    global deleted_book_tags
    deleted_book_tags += sql2
    deleted_book_tags_all.append(deleted_book_tags)

    db.session.commit()
    return """<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Refresh" content="0; url=/tags" />
</head>
</html>"""


@app.route("/undoTagDelete", methods=["GET", "POST"])
def undoTagDelete():
    global deleted_tag
    global deleted_book_tags
    sql = "insert into library_tags (tag_id, tag_name, description, created_by, created_at, updated_at) values ('" + str(deleted_tag[0]['tag_id']) + "','" + str(deleted_tag[0]['tag_name']) + "','" + str(deleted_tag[0]['description']) + "','" + str(deleted_tag[0]['created_by']) + "','" + str(deleted_tag[0]['created_at']) + "','" + str(deleted_tag[0]['updated_at']) + "')"
    db.session.execute(sql)
    for i in deleted_book_tags:
        sql1 = "insert into library_books_tags (book_id, tag_id) values ('" + str(i['book_id']) + "','" + str(deleted_tag[0]['tag_id']) + "')"
        db.session.execute(sql1)
    db.session.commit()
    deleted_tag.clear()
    deleted_book_tags.clear()
    return """<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Refresh" content="0; url=/tags" />
</head>
</html>"""

deleted_book = []
deleted_books_all = [[]]
deleted_tags = []
deleted_tags_to_books_all = [[]]
@app.route("/bookDelete/<string:id>", methods=["GET", "POST"])
def bookDelete(id):
    global deleted_book
    global deleted_tags

    deleted_book.clear()
    deleted_tags.clear()
    sql3 = "select * from library_books where id = '" + str(id) + "'"
    sql3 = db.session.execute(sql3)
    sql3 = [dict(x) for x in sql3]
    deleted_book += sql3
    pprint(deleted_book)

    sql2 = "select tag_id from library_books_tags where book_id = '" + str(id) + "'"
    sql2 = db.session.execute(sql2)
    sql2 = [dict(x) for x in sql2]
    deleted_tags += sql2

    sql1 = "delete from library_books where id = '" + str(id) + "'"

    sql = "delete from library_books_tags where book_id = '" + str(id) + "'" 

    db.session.execute(sql)
    db.session.execute(sql1)

    db.session.commit()
    return """<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Refresh" content="0; url=/book-tags" />
</head>
</html>"""


@app.route("/undoBookDelete", methods=["GET", "POST"])
def undoBookDelete():
    global deleted_book
    global deleted_tags
    sql = "insert into library_books (author, created_at, updated_at, id, notes, renert_id, title) values ('" + str(deleted_book[0]['author']) + "','" + str(deleted_book[0]['created_at']) + "','" + str(deleted_book[0]['updated_at']) + "','" + str(deleted_book[0]['id']) + "','" + str(deleted_book[0]['notes']) + "','" + str(deleted_book[0]['renert_id']) + "','" + str(deleted_book[0]['title']) + "')"
    db.session.execute(sql)
    for i in deleted_tags:
        sql1 = "insert into library_books_tags (book_id, tag_id) values ('" + str(deleted_book[0]['renert_id']) + "','" + str(i['tag_id']) + "')"
        db.session.execute(sql1)
    db.session.commit()
    deleted_book.clear()
    deleted_tags.clear()
    return """<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Refresh" content="0; url=/book-tags" />
</head>
</html>"""

# Delete tag with ajax
@app.route("/delTag/<int:id>", methods=["GET", "POST"])
def delTag(id):
    global deleted_tag
    global deleted_book_tags
    deleted_tag.clear()
    deleted_book_tags.clear()
    sql3 = "select * from library_tags where tag_id = '" + str(id) + "'"
    sql3 = db.session.execute(sql3)
    sql3 = [dict(x) for x in sql3]
    deleted_tag += sql3
    deleted_tag_all.append(deleted_tag)

    sql1 = "delete from library_tags where tag_id = '" + str(id) + "'"

    sql2 = "select book_id from library_books_tags where tag_id = '" + str(id) + "'"
    sql2 = db.session.execute(sql2)
    sql2 = [dict(x) for x in sql2]

    sql = "delete from library_books_tags where tag_id = '" + str(id) + "'" 

    db.session.execute(sql)
    db.session.execute(sql1)

    deleted_book_tags += sql2
    deleted_book_tags_all.append(deleted_book_tags)

    db.session.commit()
    return "yay"

# Undo tag deletion with ajax
@app.route("/undoTagDel", methods=["GET", "POST"])
def undoTagDel():
    global deleted_tag
    global deleted_book_tags
    sql = "insert into library_tags (tag_id, tag_name, description, created_by, created_at, updated_at) values ('" + str(deleted_tag[0]['tag_id']) + "','" + str(deleted_tag[0]['tag_name']) + "','" + str(deleted_tag[0]['description']) + "','" + str(deleted_tag[0]['created_by']) + "','" + str(deleted_tag[0]['created_at']) + "','" + str(deleted_tag[0]['updated_at']) + "')"
    db.session.execute(sql)
    for i in deleted_book_tags:
        sql1 = "insert into library_books_tags (book_id, tag_id) values ('" + str(i['book_id']) + "','" + str(deleted_tag[0]['tag_id']) + "')"
        db.session.execute(sql1)
    db.session.commit()
    deleted_tag.clear()
    deleted_book_tags.clear()
    return "yay"

# Send the most recently deleted tag with ajax
@app.route("/getTags")
def getTags():
    global deleted_tag
    return deleted_tag[0]

# Delete book with ajax
@app.route("/delBook/<int:id>", methods=["GET", "POST"])
def delBook(id):
    global deleted_book
    global deleted_tags
    deleted_book.clear()
    deleted_tags.clear()

    deleted_book.clear()
    deleted_tags.clear()
    sql3 = "select * from library_books where id = '" + str(id) + "'"
    sql3 = db.session.execute(sql3)
    sql3 = [dict(x) for x in sql3]
    deleted_book += sql3
    pprint(deleted_book)

    sql2 = "select tag_id from library_books_tags where book_id = '" + str(id) + "'"
    sql2 = db.session.execute(sql2)
    sql2 = [dict(x) for x in sql2]
    deleted_tags += sql2

    sql1 = "delete from library_books where id = '" + str(id) + "'"

    sql = "delete from library_books_tags where book_id = '" + str(id) + "'" 

    db.session.execute(sql)
    db.session.execute(sql1)

    db.session.commit()
    
    return "book deleted"

# Undo book deletion with ajax
@app.route("/undoBookDel", methods=["GET", "POST"])
def undoBookDel():
    global deleted_book
    global deleted_tags
    sql = "insert into library_books (author, created_at, updated_at, id, notes, renert_id, title) values ('" + str(deleted_book[0]['author']) + "','" + str(deleted_book[0]['created_at']) + "','" + str(deleted_book[0]['updated_at']) + "','" + str(deleted_book[0]['id']) + "','" + str(deleted_book[0]['notes']) + "','" + str(deleted_book[0]['renert_id']) + "','" + str(deleted_book[0]['title']) + "')"
    db.session.execute(sql)
    for i in deleted_tags:
        sql1 = "insert into library_books_tags (book_id, tag_id) values ('" + str(deleted_book[0]['renert_id']) + "','" + str(i['tag_id']) + "')"
        db.session.execute(sql1)
    db.session.commit()
    deleted_book.clear()
    deleted_tags.clear()
    return "undone book delete"

# Send the most recently deleted tag with ajax
@app.route("/getBook")
def getBook():
    global deleted_book
    return deleted_book[0]

edited_tag = []
edited_tags = [[]]

# Apply edits to a tag with ajax
@app.route("/applyTag/<int:id>", methods=["GET", "POST"])
def applyTag(id):
    global edited_tag
    global edited_tags
    edited_tag.clear()
    value1 = request.form["val1"]
    value2 = request.form["val2"]

    sql1 = "select tag_name, description from library_tags where tag_id = '" + str(id) + "'"
    sql1 = db.session.execute(sql1)
    sql1 = [dict(x) for x in sql1]

    edited_tag.append(sql1[0]["tag_name"])
    edited_tag.append(sql1[0]["description"])
    edited_tag.append(id)
    edited_tags.append(edited_tag)
    sql = "update library_tags set tag_name = '" + str(value1) + "' , description = '" + str(value2) + "' where tag_id = '" + str(id) + "'"
    db.session.execute(sql)
    db.session.commit()
    return "applied"

# Undo tag edits with ajax
@app.route("/undoTagEdit", methods=["GET", "POST"])
def undoTagEdit():
    global edited_tag
    sql = "update library_tags set tag_name = '" + str(edited_tag[0]) + "' , description = '" + str(edited_tag[1]) + "' where tag_id = '" + str(edited_tag[2]) + "'"
    db.session.execute(sql)
    db.session.commit()
    edited_tag.clear()
    return "edited"

# Send the data from the most recently edited tag with ajax
@app.route("/getEditedTag")
def getEditedTag():
    global edited_tag
    pprint(edited_tag)
    return jsonify(edited_tag)

edited_book = []
edited_books = [[]]

# Edit book with ajax
@app.route("/applyBook/<string:id>", methods=["GET", "POST"])
def applyBook(id):
    global edited_book
    global edited_books
    edited_book.clear()
    value1 = request.form["val1"]
    value2 = request.form["val2"]

    sql1 = "select title, author from library_books where renert_id = '" + str(id) + "'"
    pprint(sql1)
    sql1 = db.session.execute(sql1)
    sql1 = [dict(x) for x in sql1]

    edited_book.append(sql1[0]["title"])
    edited_book.append(sql1[0]["author"])
    edited_book.append(id)
    edited_books.append(edited_book)
    sql = "update library_books set title = '" + str(value1) + "' , author = '" + str(value2) + "' where renert_id = '" + str(id) + "'"
    db.session.execute(sql)
    db.session.commit()
    return "applied"

# Undo book edits with ajax
@app.route("/undoBookEdit", methods=["GET", "POST"])
def undoBookEdit():
    global edited_book
    sql = "update library_books set title = '" + str(edited_book[0]) + "' , author = '" + str(edited_book[1]) + "' where renert_id = '" + str(edited_book[2]) + "'"
    db.session.execute(sql)
    db.session.commit()
    edited_book.clear()
    return "edited"

# Send the data from the most recently edited book with ajax
@app.route("/getEditedBook")
def getEditedBook():
    global edited_book
    return jsonify(edited_book)