from flask import Flask, send_from_directory
from flask.globals import request
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
    password = db.Column(db.String(80), unique=False, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username


@app.route('/')
def index():
    return send_from_directory('public', 'index.html')


class Profile(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Authorization', location='headers')
        args = parser.parse_args()
        print(args)
        if args['Authorization'] == 'Basic ' + '123':
            return {'message': 'success', 'data': {'username': 'user1'}}, 200
        return {'message': 'Access denied'}, 403


class Register(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username')
        parser.add_argument('email')
        parser.add_argument('password')
        args = parser.parse_args()
        print(args)
        return args


class Login(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username')
        parser.add_argument('password')
        args = parser.parse_args()
        print(args)
        return args, 200, {'Authorization': 'Basic 123'}


api.add_resource(Profile, '/api/profile')
api.add_resource(Register, '/api/register')
api.add_resource(Login, '/api/login')
