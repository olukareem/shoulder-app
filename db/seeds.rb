User.destroy_all
Category.destroy_all
Post.destroy_all

user = User.create!(username: "Admin", email: "0@0.com", password: "password")
user = User.create!(username: "User1", email: "1@1.com", password: "password")
user = User.create!(username: "User2", email: "2@2.com", password: "password")
user = User.create!(username: "User3", email: "3@3.com", password: "password")
user = User.create!(username: "User4", email: "4@4.com", password: "password")
user = User.create!(username: "User5", email: "5@5.com", password: "password")
user = User.create!(username: "User6", email: "6@6.com", password: "password")
user = User.create!(username: "User7", email: "7@7.com", password: "password")
user = User.create!(username: "User8", email: "8@8.com", password: "password")
user = User.create!(username: "User9", email: "9@9.com", password: "password")
user = User.create!(username: "User10", email: "10@10.com", password: "password")
user = User.create!(username: "User11", email: "11@11.com", password: "password")
user = User.create!(username: "User12", email: "12@12.com", password: "password")
user = User.create!(username: "User13", email: "13@13.com", password: "password")
user = User.create!(username: "User14", email: "14@14.com", password: "password")
user = User.create!(username: "User15", email: "15@15.com", password: "password")

category = Category.create!([
    {name: "Help Needed"}, 
    {name: "Advice"},
    {name: "Jobs"}, 
    {name: "Housing"},
    {name: "Education"}, 
    {name: "Wellness"},
    {name: "Services"}, 
    {name: "Journal"},
    {name: "Career"}, 
    {name: "Mental Health"},
    {name: "Romance"}, 
    {name: "Self Love"}, 
    {name: "Discussion"},
    {name: "Lifestyle"}, 
    {name: "Finance"},
    {name: "Donation"}, 
    {name: "Events"},
    {name: "Community"}, 
    {name: "POC"},
    {name: "LGBTQIA"}, 
    {name: "Youth"},
    {name: "Migrant"}, 
    {name: "Family"}
    ])


post1 = Post.new(
        user: user,
        title: "Test post",
        description: 'Looking for roommates',
        body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata

        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam 
        
        At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 
        
        
        
        At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. '
    )
post1.categories << category[0]
post1.save



