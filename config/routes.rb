Rails.application.routes.draw do
  resources :categories
  resources :users do
    resources :posts
  end
  resources :users
  post '/favorite/:post_id/:user_id', to: 'users#favorite'
  post '/auth/login', to: 'authentication#login'
  get '/auth/verify', to: 'authentication#verify'
end
