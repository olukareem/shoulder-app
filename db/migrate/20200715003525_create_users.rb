class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :username
      t.string :password_digest
      t.text :image_url
      t.string :full_name
      t.text :bio
      t.string :contact
      t.boolean :is_anonymous

      t.timestamps
    end
  end
end
