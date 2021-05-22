from flask import Flask, send_from_directory
from flask.globals import request
from flask_restful import Resource, Api, reqparse
from flask_sqlalchemy import SQLAlchemy
from argon2 import PasswordHasher
ph = PasswordHasher()

app = Flask(__name__, static_url_path='', static_folder='public')
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

SECRET = 'secret'


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

    def as_dict(self):
        return {'id': self.id, 'username': self.username, 'email': self.email}


@app.route('/')
def index():
    return send_from_directory('public', 'index.html')


class Profile(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('Authorization', location='headers')
        args = parser.parse_args()
        auth = args['Authorization'].split()[1].split(',')
        print('AUTH')
        print(auth)
        user = User.query.filter_by(id=auth[0]).first()
        if not user:
            return {'message': 'User not found'}, 404

        print(user.as_dict())

        if ph.verify(user.password, auth[1]):
            return {'message': 'success', 'data': {'username': user.username, 'email': user.email}}, 200
        return {'message': 'Access denied'}, 403


class Register(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username')
        parser.add_argument('email')
        parser.add_argument('password')
        args = parser.parse_args()
        print(args)
        new_user = User(username=args['username'],
                        email=args['email'], password=ph.hash(args['password']))
        db.session.add(new_user)
        db.session.commit()
        print(new_user)
        return new_user.as_dict(), 201


class Login(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username')
        parser.add_argument('password')
        args = parser.parse_args()
        print(args)
        user = User.query.filter_by(username=args['username']).first()
        if not user:
            return {'message': 'Invalid username or password'}, 401
        return {'user': {'id': user.id, 'username': user.username}}, 200, {'Authorization': f'Bearer {user.id},{args["password"]}'}


api.add_resource(Profile, '/api/profile')
api.add_resource(Register, '/api/register')
api.add_resource(Login, '/api/login')

db.drop_all()
db.create_all()
