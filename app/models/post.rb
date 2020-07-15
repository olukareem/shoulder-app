class Post < ApplicationRecord
  belongs_to :user
  belongs_to :category
  validates :title, presence: true, length: {minimum: 6, maximum: 100}
validates :body, presence: true, length: {minimum: 10, maximum: 2000}
validates :description, presence: true, length: {minimum: 10, maximum: 300}
end
