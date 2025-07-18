main();




/*
Steps:

First, get the parent 
then loop every elementbyclass name and children until we find specifically the 



*/

async function main(){

    const observer = new MutationObserver(() => {

        const tweets = document.querySelectorAll('[data-testid="cellInnerDiv"]');
        if (tweets.length > 0) {

            tweets.forEach((userItem) => {
            
                test = userItem.querySelector('a[href="/grok"]');
                if(test!=null){
                     userItem.style.display = "none";
                }
                
            });   
        }
    });


    //basic loop
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    




}