Rails.application.routes.draw do
  resources :categories
#   post '/login', to: 'sessions#create'
#   delete '/logout', to: 'sessions#destroy'
#   get '/logged_in', to: 'sessions#is_logged_in?'
  resources :users, only: [:create, :show, :index] do
    resources :posts
  end
  resources :users
  post '/favorite/:post_id/:user_id', to: 'users#favorite'
  post '/auth/login', to: 'authentication#login'
  get '/auth/verify', to: 'authentication#verify'
end
