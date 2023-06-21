

    modifier onlyOwner() {
        require(msg.sender == owner, "Sender is not the owner");
        _;
    }
    
    function helloWorld() public view returns (string memory) {
        return text;
    }

    function setText(string calldata newText) public onlyOwner {
        text = newText;
    }

    function transferOwnership (address newOnwer) public onlyOwner {
        owner = newOnwer;
    }

    function pureText() public pure returns (string memory) {
        return "Hello World";
    }

    function _isPure() internal view returns (bool check_) {
        check_ = keccak256(bytes(text)) == keccak256(bytes(pureText()));
    }

    function isPure() public view returns (bool returnValue_) {
        returnValue_ = _isPure();
    }

    function _restore() internal {
        text = pureText();
    }

    function restore() public onlyOwner returns (bool)  {
        //if (_isPure()) return false;
        require(!_isPure(), "The string was not modified");
        _restore();
        return true;
    }
}
