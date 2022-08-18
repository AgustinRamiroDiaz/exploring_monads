import Data.Maybe

plusOne :: Integer -> Maybe Integer
plusOne x = Just (x + 1)

nothing :: Integer -> Maybe Integer
nothing _ = Nothing


test :: Integer -> Maybe Integer
test x = do 
    y <- plusOne x
    z <- plusOne y
    return z

main :: IO()
main = do
    let result = do
                    y <- plusOne 0
                    z <- plusOne y
                    return z
    print result
