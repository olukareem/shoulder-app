class Post < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :categories
  validates :title, presence: true, length: {minimum: 4, maximum: 100}
validates :body, presence: true, length: {minimum: 10, maximum: 2000}
validates :description, presence: true, length: {minimum: 10, maximum: 300}
end
