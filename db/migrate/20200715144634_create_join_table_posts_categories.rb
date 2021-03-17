class CreateJoinTablePostsCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :categories_potss, id: false do |t|
      t.belongs_to :category
      t.belongs_to :post

    end
  end
end
