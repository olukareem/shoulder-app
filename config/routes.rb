Rails.application.routes.draw do
  resources :categories
  resources :users do
    resources :posts
  end

  post '/auth/login', to: 'authentication#login'
  get '/auth/verify', to: 'authentication#verify'
end
