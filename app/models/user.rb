class User < ApplicationRecord
    has_many :posts, dependent: :destroy
    has_secure_password
    validates :password, length: { minimum: 6 }, on: :create
    validates :username, format: { with: /\A[a-zA-Z0-9]+\Z/ }, presence: true, uniqueness: true
    validates :email, presence: false, uniqueness: true
    validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i

end
