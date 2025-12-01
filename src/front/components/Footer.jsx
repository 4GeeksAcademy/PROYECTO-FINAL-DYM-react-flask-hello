export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center text-white"
		style={{
                background: "linear-gradient(90deg, #d42424, #3b4cca)",
                padding: "12px 20px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)"
            }}
			>
		<p>
			Proyecto Final Pokédex • React + Flask • PokéAPI
		</p>
		<p>
			Made with <i className="fa fa-heart text-danger " /> by D&M {" "}
			<a href="http://www.4geeksacademy.com">4Geeks Academy</a>
		</p>
	</footer>
);
