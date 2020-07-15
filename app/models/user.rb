class User < ApplicationRecord
    has_many :posts, dependent: :destroy
    has_secure_password
    validates :password, length: { minimum: 6 }, on: :create
    validates :username, presence: true, uniqueness: true
    validates :email, presence: true, uniqueness: true
  

end
