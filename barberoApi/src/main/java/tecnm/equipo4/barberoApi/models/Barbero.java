package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "barbero")
public class Barbero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idBarbero")
    private Long idBarbero;

    @NotBlank
    @Column(name = "nombreCompleto")
    private String nombreCompleto;

    @NotBlank
    @Size(min = 10, max = 12)
    @Column(name = "telefono")
    @Pattern(regexp = "^\\d{3}[-\\s]?\\d{3}[-\\s]?\\d{4}$")
    private String telefono;

    @NotBlank
    @Email
    @Column(name = "email")
    private String email;

    @NotBlank
    @Column(name = "password")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$",
            message = "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial")
    private String password;

    @NotBlank
    @Column(name = "tipoUsuario")
    private String tipoUsuario;

    @NotNull
    @Column(name = "experiencia")
    @Min(value = 1)
    private int experiencia;

    @NotBlank
    @Column(name = "tituloRol")
    private String tituloRol;

    @Lob
    @Column(name = "foto", columnDefinition = "LONGBLOB")
    private byte[] foto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idSucursal")
    @JsonIgnoreProperties({"barberos", "hibernateLazyInitializer", "handler"})
    private Sucursal sucursal;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<DisponibilidadBarbero> disponibilidades = new ArrayList<>();

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "barbero", cascade = CascadeType.ALL)
    private List<ClienteBarbero> clientesBarberos = new ArrayList<>();
}