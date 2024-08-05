/**
 * Vvveb
 *
 * Copyright (C) 2021  Ziadin Givan
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
 
let template = 
`<ul class="list-unstyled" data-v-component-product-vendors="sidebar">
	<li data-v-vendor>
		  <a href="/manufacturer/mango" data-v-vendor-url><span data-v-vendor-name>Mango</span></a>
	</li>
	<li data-v-vendor>
		  <a href="/manufacturer/mango" data-v-vendor-url><span data-v-vendor-name>Assos</span></a>
	</li>
	<li data-v-vendor>
		  <a href="/manufacturer/mango" data-v-vendor-url><span data-v-vendor-name>Brand name</span></a>
	</li>
</ul>`;
 
class VendorsComponent {
	constructor ()
	{
		this.name = "Vendors";
		this.attributes = ["data-v-component-vendors"],

		this.image ="icons/vendor.svg";
		this.html = template;
		
		this.properties = [];
	}

    init(node)
	{
		document.querySelectorAll('.mb-3[data-group]').forEach((el, i) => {
			el.classList.add("d-none");
		});			
		
		let source = node.dataset.vSource;
		if (!source) {
			source = "automatic";
		} 

		document.querySelectorAll('.mb-3[data-group="' + source + '"]').forEach(e => e.classList.remove("d-none"));
	}
}

let vendorsComponent = new VendorsComponent;

export {
  vendorsComponent
};
