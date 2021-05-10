from flask import Flask, send_from_directory
from flask_restful import Resource, Api, reqparse
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_url_path='', static_folder='public')
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username


@app.route('/')
def hello_world():
    return send_from_directory('public', 'index.html')


class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}


class Test(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        args = parser.parse_args()
        print(args)
        return args


api.add_resource(HelloWorld, '/api/helloworld')
api.add_resource(Test, '/api/test')
