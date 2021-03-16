Rails.application.routes.draw do

# root 'homepage#index'


  resources :categories
#   post '/login', to: 'sessions#create'
#   delete '/logout', to: 'sessions#destroy'
#   get '/logged_in', to: 'sessions#is_logged_in?'
  resources :users, only: [:create, :show, :index] do
    resources :posts
  end
  resources :posts


  resources :users
  get '/onepost/:id', to: 'posts#get_one_post'
  post '/favorite/:post_id/:user_id', to: 'users#favorite'
  post '/delete/:id' => 'posts#delete'
  post '/auth/login', to: 'authentication#login'
  get '/auth/verify', to: 'authentication#verify'
  
end
