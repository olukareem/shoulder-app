class User < ApplicationRecord
    has_many :posts, dependent: :destroy
    has_secure_password
    validates :password, length: { minimum: 6 }, on: :create
    validates :username, presence: true, uniqueness: true
    validates :email, presence: false, uniqueness: true
    validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i

end
