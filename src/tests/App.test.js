import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../components/Home";
import App from "../App";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import DisplayVeganSnacks from "../components/DisplayVeganSnacks"; // Component for displaying vegan snacks
import ApplyForm from "../components/ApplyForm"; // Form for applying to add a vegan snack

test("renders_home_component_with_title_and_description", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(screen.getByText("Welcome to the Vegan Snacks App!")).toBeInTheDocument();
  expect(screen.getByText(/Explore a delightful range of vegan snacks! Enjoy tasty, guilt-free treats made from natural ingredients./)).toBeInTheDocument();
});

test("home_component_renders_add_your_vegan_snack_button_with_link_to_apply", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  const addSnackButton = screen.getByText("Add Your Vegan Snack");
  
  expect(addSnackButton).toBeInTheDocument();
  expect(addSnackButton).toHaveAttribute("href", "/apply");
});

test("renders_navbar_in_App_component_with_links", () => {
  render(<App />);

  const titleElement = screen.getByText("Vegan Snacks Application");
  const homeLink = screen.getByText("Home");
  const snackDetailsLink = screen.getByText("Snacks Details");

  expect(titleElement).toBeInTheDocument();
  expect(homeLink).toBeInTheDocument();
  expect(snackDetailsLink).toBeInTheDocument();
});

test("checks_link_destinations", () => {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );

  const homeLink = screen.getByText("Home");
  const snackDetailsLink = screen.getByText("Snacks Details");

  expect(homeLink).toHaveAttribute("href", "/");
  expect(snackDetailsLink).toHaveAttribute("href", "/getAllVeganSnacks");
});

test("renders_footer_component_with_copyright_text", () => {
  render(<Footer />);

  const copyrightText = screen.getByText(
    /2024 Vegan Snacks Application. All rights reserved./i
  );

  expect(copyrightText).toBeInTheDocument();
});

test("fetches_and_displays_snack_applications", async () => {
  const MOCK_DATA = [
    {
      snackName: "Vegan Chocolate Bar",
      snackType: "Dessert",
      quantity: "100 grams",
      price: 250, // Changed to integer
      expiryInMonths: 12,
    },
    {
      snackName: "Crispy Kale Chips",
      snackType: "Savory",
      quantity: "50 grams",
      price: 300, // Changed to integer
      expiryInMonths: 6,
    },
  ];

  const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(MOCK_DATA),
  });

  render(<DisplayVeganSnacks />);

  await waitFor(() => {
    MOCK_DATA.forEach((snack) => {
      expect(screen.getByText(snack.snackName)).toBeInTheDocument();
      expect(screen.getByText(snack.snackType)).toBeInTheDocument();
      expect(screen.getByText(snack.quantity)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`^Rs\\.${snack.price}$`))).toBeInTheDocument(); // Regex updated to match whole numbers
      expect(screen.getByText(snack.expiryInMonths)).toBeInTheDocument();
    });
  });

  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining("/getAllVeganSnacks"),
    expect.objectContaining({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
  fetchMock.mockRestore();
});

test("submits_valid_application_form", async () => {
  render(
    <MemoryRouter>
      <ApplyForm />
    </MemoryRouter>
  );

  // Fill in the form
  fireEvent.change(screen.getByLabelText('Snack Name:'), { target: { value: 'Vegan Chocolate Bar' } });
  fireEvent.change(screen.getByLabelText('Snack Type:'), { target: { value: 'Dessert' } });
  fireEvent.change(screen.getByLabelText('Quantity:'), { target: { value: '100 grams' } });
  fireEvent.change(screen.getByLabelText('Price:'), { target: { value: 200 } }); // Changed to whole number
  fireEvent.change(screen.getByLabelText('Expiry (in months):'), { target: { value: 12 } });

  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true });

  // Submit the form
  fireEvent.click(screen.getByText('Submit'));

  // Wait for the success message to appear
  await waitFor(() => {
    expect(screen.getByText('Snack submitted successfully!')).toBeInTheDocument(); 
  });

  fetchMock.mockRestore();
});

test("submits_invalid_application_form", () => {
  render(
    <MemoryRouter>
      <ApplyForm />
    </MemoryRouter>
  );

  const submitButton = screen.getByText('Submit');
  fireEvent.click(submitButton);

  // Check for validation error messages
  expect(screen.getByText('Snack Name is required')).toBeInTheDocument();
  expect(screen.getByText('Snack Type is required')).toBeInTheDocument();
  expect(screen.getByText('Quantity is required')).toBeInTheDocument();
  expect(screen.getByText('Price is required')).toBeInTheDocument();
  expect(screen.getByText('Expiry in months is required')).toBeInTheDocument();
});

test("checks_all_components_and_routes", () => {
  render(<App />);
  
  const homeLink = screen.getByText(/Home/i);
  fireEvent.click(homeLink);
  expect(screen.getByText('Welcome to the Vegan Snacks App!')).toBeInTheDocument();
  
  const addSnackLink = screen.getByText('Add Your Vegan Snack');
  fireEvent.click(addSnackLink);
  expect(screen.getByText('Add a Vegan Snack')).toBeInTheDocument();

  const snackDetailsLink = screen.getByText('Snacks Details');
  fireEvent.click(snackDetailsLink);
  expect(screen.getByText('Submitted Vegan Snacks')).toBeInTheDocument();
});
