User.destroy_all
Category.destroy_all
Post.destroy_all

user = User.create!(username: "Admin", email: "0@0.com", password: "password")
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
    {name: "Love & Romance"}, 
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