import Data.Maybe

plusOne :: Integer -> Maybe Integer
plusOne x = Just (x + 1)

nothing :: Integer -> Maybe Integer
nothing _ = Nothing

(>=>) :: Monad m => (a -> m b) -> (b -> m c) -> (a -> m c)
(>=>) f g x = f x >>= g

main :: IO()
main = do
    let result = do
                    y <- plusOne 0
                    z <- (plusOne >=> plusOne) y
                    return z
    print result
