const Settings = () => {
    const handleColorChange = (event) => {
        const [primaryColor, secondaryColor] = event.target.value.split(',');
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    };

    return (
        <div className="settings-container">
            <div className="settings-card">
                <h2>Settings</h2>
                <form className="change-color-form">
                    <label htmlFor="color">UI Color Theme</label>
                    <select id="color" name="color" onChange={handleColorChange} className="form-input">
                        <option value="#D92652,#B91E44">Red</option>
                        <option value="#2652D9,#1E44B9">Blue</option>
                        <option value="#D9B926,#B99C1E">Yellow</option>
                        <option value="#52D926,#44B91E">Green</option>
                    </select>
                </form>
            </div>
        </div>
    )
}

export default Settings